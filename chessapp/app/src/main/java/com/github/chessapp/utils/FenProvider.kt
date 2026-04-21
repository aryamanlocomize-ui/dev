package com.github.chessapp.utils

object FenProvider {
    val midGameFens = listOf(
        "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5",
        "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 1 5",
        // Add more FENs here
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" // initial for testing
    )

    fun getRandomMidGameFen(): String {
        return midGameFens.random()
    }
}