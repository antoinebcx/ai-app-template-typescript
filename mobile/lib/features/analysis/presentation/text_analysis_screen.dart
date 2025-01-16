import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_app/core/services/ai_service.dart';
import 'package:mobile_app/core/models/analysis_response.dart';

final aiServiceProvider = Provider((ref) => AiService());

class TextAnalysisScreen extends ConsumerStatefulWidget {
  const TextAnalysisScreen({super.key});

  @override
  ConsumerState<TextAnalysisScreen> createState() => _TextAnalysisScreenState();
}

class _TextAnalysisScreenState extends ConsumerState<TextAnalysisScreen> {
  final _textController = TextEditingController();
  bool _isLoading = false;
  AnalysisResponse? _result;

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _analyzeText() async {
    if (_textController.text.isEmpty) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final result =
          await ref.read(aiServiceProvider).analyzeText(_textController.text);
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
        title: const Text('Text Analysis'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _textController,
              maxLines: 5,
              decoration: const InputDecoration(
                hintText: 'Enter text to analyze...',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: _isLoading ? null : _analyzeText,
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Analyze'),
            ),
            if (_result != null) ...[
              const SizedBox(height: 24),
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
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
