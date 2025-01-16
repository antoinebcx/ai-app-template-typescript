import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:mobile_app/core/services/ai_service.dart';
import 'package:mobile_app/core/models/analysis_response.dart';

final aiServiceProvider = Provider((ref) => AiService());

class ImageAnalysisScreen extends ConsumerStatefulWidget {
  const ImageAnalysisScreen({super.key});

  @override
  ConsumerState<ImageAnalysisScreen> createState() =>
      _ImageAnalysisScreenState();
}

class _ImageAnalysisScreenState extends ConsumerState<ImageAnalysisScreen> {
  final _imagePicker = ImagePicker();
  bool _isLoading = false;
  String? _selectedImagePath;
  AnalysisResponse? _result;

  Future<void> _pickImage(ImageSource source) async {
    final pickedFile = await _imagePicker.pickImage(source: source);

    if (pickedFile != null) {
      setState(() {
        _selectedImagePath = pickedFile.path;
      });
    }
  }

  Future<void> _analyzeImage() async {
    if (_selectedImagePath == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final result =
          await ref.read(aiServiceProvider).analyzeImage(_selectedImagePath!);
      setState(() {
        _result = result;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Image Analysis'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                FilledButton.icon(
                  onPressed:
                      _isLoading ? null : () => _pickImage(ImageSource.camera),
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Camera'),
                ),
                FilledButton.icon(
                  onPressed:
                      _isLoading ? null : () => _pickImage(ImageSource.gallery),
                  icon: const Icon(Icons.photo_library),
                  label: const Text('Gallery'),
                ),
              ],
            ),
            if (_selectedImagePath != null) ...[
              const SizedBox(height: 16),
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                  'file://$_selectedImagePath',
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _isLoading ? null : _analyzeImage,
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Analyze Image'),
              ),
            ],
            if (_result != null) ...[
              const SizedBox(height: 24),
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Extracted Text:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Text(_result!.text),
                      const SizedBox(height: 16),
                      Text(
                        'Reasoning:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Text(_result!.reasoning),
                      const SizedBox(height: 16),
                      Text(
                        'Analysis:',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Text(_result!.analysis.toString()),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
