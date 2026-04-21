package com.github.chessapp.domain.chess

enum class Piece(val symbol: Char) {
    WHITE_PAWN('P'),
    WHITE_KNIGHT('N'),
    WHITE_BISHOP('B'),
    WHITE_ROOK('R'),
    WHITE_QUEEN('Q'),
    WHITE_KING('K'),
    BLACK_PAWN('p'),
    BLACK_KNIGHT('n'),
    BLACK_BISHOP('b'),
    BLACK_ROOK('r'),
    BLACK_QUEEN('q'),
    BLACK_KING('k');

    val isWhite: Boolean get() = symbol.isUpperCase()
    val isBlack: Boolean get() = symbol.isLowerCase()
}