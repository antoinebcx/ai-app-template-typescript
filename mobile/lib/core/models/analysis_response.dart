import 'package:json_annotation/json_annotation.dart';

part 'analysis_response.g.dart';

@JsonSerializable()
class AnalysisResponse {
  final String text;
  final String reasoning;
  final Map<String, dynamic> analysis;

  AnalysisResponse({
    required this.text,
    required this.reasoning,
    required this.analysis,
  });

  factory AnalysisResponse.fromJson(Map<String, dynamic> json) =>
      _$AnalysisResponseFromJson(json);

  Map<String, dynamic> toJson() => _$AnalysisResponseToJson(this);
}
