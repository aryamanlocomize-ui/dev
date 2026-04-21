package com.github.chessapp.domain.model

data class Timers(
    val globalTimeLeft: Long, // in milliseconds
    val whiteTimeLeft: Long,
    val blackTimeLeft: Long,
    val lastMoveTime: Long // timestamp
)