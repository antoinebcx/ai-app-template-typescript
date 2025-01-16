import 'package:dio/dio.dart';
import 'dart:convert';
import 'package:mobile_app/core/models/analysis_response.dart';

class AiService {
  final Dio _dio;
  final String baseUrl = 'http://localhost:3000'; // Backend URL

  AiService() : _dio = Dio() {
    _dio.options.baseUrl = baseUrl;
  }

  Future<AnalysisResponse> analyzeText(String text) async {
    try {
      final response =
          await _dio.post('/api/analyze/text', data: {'text': text});
      return AnalysisResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to analyze text: $e');
    }
  }

  Future<AnalysisResponse> analyzeAudio(String audioPath) async {
    try {
      final formData = FormData.fromMap({
        'audio': await MultipartFile.fromFile(audioPath),
      });
      final response = await _dio.post('/api/analyze/audio', data: formData);
      return AnalysisResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to analyze audio: $e');
    }
  }

  Future<AnalysisResponse> analyzeImage(String imagePath) async {
    try {
      final formData = FormData.fromMap({
        'image': await MultipartFile.fromFile(imagePath),
      });
      final response = await _dio.post('/api/analyze/image', data: formData);
      return AnalysisResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to analyze image: $e');
    }
  }
}
