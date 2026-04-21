package com.github.chessapp.domain.model

enum class GameStatus {
    WAITING,
    IN_PROGRESS,
    CHECKMATE,
    STALEMATE,
    TIME_UP,
    DRAW,
    RESIGNED
}