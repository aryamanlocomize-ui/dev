package com.github.chessapp.domain.chess

class ChessEngineImpl : ChessEngine {

    private val board = Array(8) { Array<Piece?>(8) { null } }
    private var currentTurn = "white"
    private var castlingRights = "KQkq"
    private var enPassant = "-"
    private var halfmoveClock = 0
    private var fullmoveNumber = 1

    override fun loadPosition(fen: String) {
        // Parse FEN and set board
        val parts = fen.split(" ")
        val position = parts[0]
        currentTurn = if (parts[1] == "w") "white" else "black"
        castlingRights = parts[2]
        enPassant = parts[3]
        halfmoveClock = parts[4].toInt()
        fullmoveNumber = parts[5].toInt()

        val ranks = position.split("/")
        for (rank in 0..7) {
            val rankStr = ranks[7 - rank] // FEN starts from rank 8
            var file = 0
            for (char in rankStr) {
                if (char.isDigit()) {
                    file += char - '0'
                } else {
                    val piece = Piece.values().find { it.symbol == char }
                    if (piece != null) {
                        board[rank][file] = piece
                        file++
                    }
                }
            }
        }
    }

    override fun getLegalMoves(square: String): List<String> {
        // Basic implementation: return possible squares
        // In real implementation, generate all legal moves
        val moves = mutableListOf<String>()
        // For simplicity, assume all adjacent squares for now
        val (file, rank) = squareToCoords(square)
        for (df in -1..1) {
            for (dr in -1..1) {
                if (df == 0 && dr == 0) continue
                val nf = file + df
                val nr = rank + dr
                if (nf in 0..7 && nr in 0..7) {
                    moves.add(coordsToSquare(nf, nr))
                }
            }
        }
        return moves
    }

    override fun makeMove(from: String, to: String): Boolean {
        // Basic move validation
        val piece = getPiece(from)
        if (piece == null) return false
        if ((currentTurn == "white" && !piece.isWhite) || (currentTurn == "black" && !piece.isBlack)) return false
        // Move piece
        setPiece(to, piece)
        setPiece(from, null)
        currentTurn = if (currentTurn == "white") "black" else "white"
        return true
    }

    override fun isCheckmate(): Boolean {
        // Stub
        return false
    }

    override fun isStalemate(): Boolean {
        // Stub
        return false
    }

    override fun isInCheck(color: String): Boolean {
        // Stub
        return false
    }

    override fun getCurrentFEN(): String {
        // Generate FEN
        val position = StringBuilder()
        for (rank in 7 downTo 0) {
            var empty = 0
            for (file in 0..7) {
                val piece = board[rank][file]
                if (piece == null) {
                    empty++
                } else {
                    if (empty > 0) {
                        position.append(empty)
                        empty = 0
                    }
                    position.append(piece.symbol)
                }
            }
            if (empty > 0) position.append(empty)
            if (rank > 0) position.append("/")
        }
        position.append(" ${if (currentTurn == "white") "w" else "b"} $castlingRights $enPassant $halfmoveClock $fullmoveNumber")
        return position.toString()
    }

    private fun getPiece(square: String): Piece? {
        val (file, rank) = squareToCoords(square)
        return board[rank][file]
    }

    private fun setPiece(square: String, piece: Piece?) {
        val (file, rank) = squareToCoords(square)
        board[rank][file] = piece
    }

    private fun squareToCoords(square: String): Pair<Int, Int> {
        val file = square[0] - 'a'
        val rank = square[1] - '1'
        return Pair(file, rank)
    }

    private fun coordsToSquare(file: Int, rank: Int): String {
        return "${('a' + file)}${rank + 1}"
    }
}