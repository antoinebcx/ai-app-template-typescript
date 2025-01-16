// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analysis_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AnalysisResponse _$AnalysisResponseFromJson(Map<String, dynamic> json) =>
    AnalysisResponse(
      text: json['text'] as String,
      reasoning: json['reasoning'] as String,
      analysis: json['analysis'] as Map<String, dynamic>,
    );

Map<String, dynamic> _$AnalysisResponseToJson(AnalysisResponse instance) =>
    <String, dynamic>{
      'text': instance.text,
      'reasoning': instance.reasoning,
      'analysis': instance.analysis,
    };
