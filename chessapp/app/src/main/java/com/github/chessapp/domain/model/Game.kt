package com.github.chessapp.domain.model

data class Game(
    val id: String,
    val fen: String,
    val moves: List<Move>,
    val whitePlayer: Player,
    val blackPlayer: Player,
    val currentTurn: String, // "white" or "black"
    val gameStatus: GameStatus,
    val timers: Timers
)