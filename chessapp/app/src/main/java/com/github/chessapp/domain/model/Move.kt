package com.github.chessapp.domain.model

data class Move(
    val from: String, // e.g., "e2"
    val to: String, // "e4"
    val timestamp: Long
)