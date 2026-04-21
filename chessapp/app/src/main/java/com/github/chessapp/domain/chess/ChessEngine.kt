package com.github.chessapp.domain.chess

interface ChessEngine {
    /**
     * Load a position from FEN string
     */
    fun loadPosition(fen: String)

    /**
     * Get legal moves for a piece on the given square
     */
    fun getLegalMoves(square: String): List<String>

    /**
     * Make a move from 'from' to 'to' square
     * Returns true if move is legal and made
     */
    fun makeMove(from: String, to: String): Boolean

    /**
     * Check if current position is checkmate
     */
    fun isCheckmate(): Boolean

    /**
     * Check if current position is stalemate
     */
    fun isStalemate(): Boolean

    /**
     * Check if the given color is in check
     */
    fun isInCheck(color: String): Boolean

    /**
     * Get current position as FEN string
     */
    fun getCurrentFEN(): String
}