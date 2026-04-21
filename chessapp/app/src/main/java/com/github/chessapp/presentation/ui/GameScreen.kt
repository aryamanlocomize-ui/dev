package com.github.chessapp.presentation.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.github.chessapp.presentation.ui.components.Chessboard
import com.github.chessapp.presentation.viewmodel.GameViewModel

@Composable
fun GameScreen(navController: NavController, gameId: String, viewModel: GameViewModel = hiltViewModel()) {
    val gameState by viewModel.gameState.collectAsState()
    val selectedSquare by viewModel.selectedSquare.collectAsState()
    val legalMoves by viewModel.legalMoves.collectAsState()

    LaunchedEffect(gameId) {
        viewModel.loadGame(gameId)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Timers
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(text = "White: ${gameState.whiteTimeLeft / 1000}s")
            Text(text = "Black: ${gameState.blackTimeLeft / 1000}s")
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Chessboard
        Chessboard(
            board = gameState.board,
            selectedSquare = selectedSquare,
            legalMoves = legalMoves,
            onSquareClick = { viewModel.onSquareClick(it) }
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Resign button
        Button(onClick = { viewModel.resign() }) {
            Text("Resign")
        }

        // Status
        Text(text = gameState.status)
    }
}