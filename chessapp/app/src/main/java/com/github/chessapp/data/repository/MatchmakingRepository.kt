package com.github.chessapp.data.repository

import com.github.chessapp.domain.model.Game
import com.github.chessapp.domain.model.Player
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

interface MatchmakingRepository {
    suspend fun joinQueue(player: Player)
    suspend fun leaveQueue(player: Player)
    fun observeMatches(): Flow<Game?>
}

@Singleton
class MatchmakingRepositoryImpl @Inject constructor(
    private val firestore: FirebaseFirestore
) : MatchmakingRepository {

    override suspend fun joinQueue(player: Player) {
        firestore.collection("queue").document(player.id).set(
            mapOf(
                "playerId" to player.id,
                "elo" to player.elo,
                "timestamp" to System.currentTimeMillis()
            )
        ).await()
    }

    override suspend fun leaveQueue(player: Player) {
        firestore.collection("queue").document(player.id).delete().await()
    }

    override fun observeMatches(): Flow<Game?> = callbackFlow {
        val listener = firestore.collection("games")
            .whereEqualTo("status", "waiting")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                // Logic to find match, but simplified
                // In real, match players with similar ELO
                // For now, just emit null or a game
                trySend(null)
            }
        awaitClose { listener.remove() }
    }
}