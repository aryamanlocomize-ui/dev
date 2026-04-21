package com.github.chessapp.presentation.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import com.github.chessapp.domain.chess.Piece

@Composable
fun Chessboard(
    board: Array<Array<Piece?>>,
    selectedSquare: String?,
    legalMoves: List<String>,
    onSquareClick: (String) -> Unit
) {
    val squareSize = 50.dp

    Canvas(
        modifier = Modifier
            .size(squareSize * 8)
            .pointerInput(Unit) {
                detectTapGestures { offset ->
                    val file = (offset.x / squareSize.toPx()).toInt()
                    val rank = 7 - (offset.y / squareSize.toPx()).toInt() // invert y
                    if (file in 0..7 && rank in 0..7) {
                        val square = "${('a' + file)}${rank + 1}"
                        onSquareClick(square)
                    }
                }
            }
    ) {
        val squarePx = squareSize.toPx()

        for (rank in 0..7) {
            for (file in 0..7) {
                val isLight = (file + rank) % 2 == 0
                val color = if (isLight) Color(0xFFF0D9B5) else Color(0xFFB58863)
                drawRect(
                    color = color,
                    topLeft = Offset(file * squarePx, (7 - rank) * squarePx),
                    size = Size(squarePx, squarePx)
                )

                val square = "${('a' + file)}${rank + 1}"
                if (square == selectedSquare) {
                    drawRect(
                        color = Color(0xFF7FBC00),
                        topLeft = Offset(file * squarePx, (7 - rank) * squarePx),
                        size = Size(squarePx, squarePx)
                    )
                }
                if (square in legalMoves) {
                    drawCircle(
                        color = Color(0xFF00FF00),
                        center = Offset((file + 0.5f) * squarePx, (7 - rank + 0.5f) * squarePx),
                        radius = squarePx / 6
                    )
                }

                val piece = board[rank][file]
                if (piece != null) {
                    // Draw piece symbol, simplified
                    drawRect(
                        color = if (piece.isWhite) Color.White else Color.Black,
                        topLeft = Offset(file * squarePx + squarePx / 4, (7 - rank) * squarePx + squarePx / 4),
                        size = Size(squarePx / 2, squarePx / 2)
                    )
                }
            }
        }
    }
}