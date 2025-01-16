import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile_app/core/theme/app_theme.dart';
import 'package:mobile_app/features/auth/presentation/login_screen.dart';
import 'package:mobile_app/features/home/presentation/home_screen.dart';
import 'package:mobile_app/features/analysis/presentation/text_analysis_screen.dart';
import 'package:mobile_app/features/analysis/presentation/audio_analysis_screen.dart';
import 'package:mobile_app/features/analysis/presentation/image_analysis_screen.dart';

void main() {
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/text-analysis',
        builder: (context, state) => const TextAnalysisScreen(),
      ),
      GoRoute(
        path: '/audio-analysis',
        builder: (context, state) => const AudioAnalysisScreen(),
      ),
      GoRoute(
        path: '/image-analysis',
        builder: (context, state) => const ImageAnalysisScreen(),
      ),
    ],
  );
});

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);

    return MaterialApp.router(
      title: 'AI Analysis Demo',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      routerConfig: router,
    );
  }
}
