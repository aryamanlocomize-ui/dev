package com.github.chessapp.data.repository

import com.github.chessapp.domain.model.Game
import com.github.chessapp.domain.model.Move
import com.google.firebase.database.FirebaseDatabase
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

interface GameRepository {
    suspend fun createGame(game: Game)
    suspend fun updateGame(gameId: String, fen: String, moves: List<Move>)
    fun observeGame(gameId: String): Flow<Game?>
    suspend fun makeMove(gameId: String, move: Move)
}

@Singleton
class GameRepositoryImpl @Inject constructor(
    private val database: FirebaseDatabase
) : GameRepository {

    private val gamesRef = database.getReference("games")

    override suspend fun createGame(game: Game) {
        gamesRef.child(game.id).setValue(game).await()
    }

    override suspend fun updateGame(gameId: String, fen: String, moves: List<Move>) {
        val updates = mapOf(
            "fen" to fen,
            "moves" to moves
        )
        gamesRef.child(gameId).updateChildren(updates).await()
    }

    override fun observeGame(gameId: String): Flow<Game?> = callbackFlow {
        val listener = gamesRef.child(gameId).addValueEventListener(object : com.google.firebase.database.ValueEventListener {
            override fun onDataChange(snapshot: com.google.firebase.database.DataSnapshot) {
                val game = snapshot.getValue(Game::class.java)
                trySend(game)
            }

            override fun onCancelled(error: com.google.firebase.database.DatabaseError) {
                close(error.toException())
            }
        })
        awaitClose { gamesRef.child(gameId).removeEventListener(listener) }
    }

    override suspend fun makeMove(gameId: String, move: Move) {
        // Add move to list
        // Simplified
    }
}