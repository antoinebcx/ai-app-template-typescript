import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import 'package:mobile_app/core/services/ai_service.dart';
import 'package:mobile_app/core/models/analysis_response.dart';

final aiServiceProvider = Provider((ref) => AiService());

class AudioAnalysisScreen extends ConsumerStatefulWidget {
  const AudioAnalysisScreen({super.key});

  @override
  ConsumerState<AudioAnalysisScreen> createState() =>
      _AudioAnalysisScreenState();
}

class _AudioAnalysisScreenState extends ConsumerState<AudioAnalysisScreen> {
  bool _isLoading = false;
  String? _selectedFilePath;
  AnalysisResponse? _result;

  Future<void> _pickAudioFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.audio,
      allowMultiple: false,
    );

    if (result != null) {
      setState(() {
        _selectedFilePath = result.files.single.path;
      });
    }
  }

  Future<void> _analyzeAudio() async {
    if (_selectedFilePath == null) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final result =
          await ref.read(aiServiceProvider).analyzeAudio(_selectedFilePath!);
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
        title: const Text('Audio Analysis'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            FilledButton.icon(
              onPressed: _isLoading ? null : _pickAudioFile,
              icon: const Icon(Icons.upload_file),
              label: const Text('Select Audio File'),
            ),
            if (_selectedFilePath != null) ...[
              const SizedBox(height: 16),
              Text(
                'Selected file: ${_selectedFilePath!.split('/').last}',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 16),
              FilledButton(
                onPressed: _isLoading ? null : _analyzeAudio,
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Analyze Audio'),
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
                        'Transcribed Text:',
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
