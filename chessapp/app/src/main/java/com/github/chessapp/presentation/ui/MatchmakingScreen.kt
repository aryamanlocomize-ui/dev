package com.github.chessapp.presentation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.github.chessapp.presentation.viewmodel.MatchmakingViewModel

@Composable
fun MatchmakingScreen(navController: NavController, viewModel: MatchmakingViewModel = hiltViewModel()) {
    val game by viewModel.game.collectAsState()

    LaunchedEffect(game) {
        game?.let {
            navController.navigate("game/${it.id}") {
                popUpTo("matchmaking") { inclusive = true }
            }
        }
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            CircularProgressIndicator()
            Spacer(modifier = Modifier.height(16.dp))
            Text(text = "Finding match...", style = MaterialTheme.typography.bodyLarge)
        }
    }
}