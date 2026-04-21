package com.github.chessapp.data.repository

import com.github.chessapp.domain.model.Player
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton

interface AuthRepository {
    suspend fun signIn(email: String, password: String): Result<Player>
    suspend fun signUp(email: String, password: String, name: String): Result<Player>
    suspend fun getCurrentPlayer(): Player?
    fun signOut()
}

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val auth: FirebaseAuth,
    private val firestore: FirebaseFirestore
) : AuthRepository {

    override suspend fun signIn(email: String, password: String): Result<Player> {
        return try {
            val result = auth.signInWithEmailAndPassword(email, password).await()
            val uid = result.user?.uid ?: return Result.failure(Exception("Sign in failed"))
            val player = getPlayerFromFirestore(uid)
            Result.success(player)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun signUp(email: String, password: String, name: String): Result<Player> {
        return try {
            val result = auth.createUserWithEmailAndPassword(email, password).await()
            val uid = result.user?.uid ?: return Result.failure(Exception("Sign up failed"))
            val player = Player(uid, name, 1200) // default ELO
            savePlayerToFirestore(player)
            Result.success(player)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getCurrentPlayer(): Player? {
        val uid = auth.currentUser?.uid ?: return null
        return getPlayerFromFirestore(uid)
    }

    override fun signOut() {
        auth.signOut()
    }

    private suspend fun getPlayerFromFirestore(uid: String): Player {
        val doc = firestore.collection("players").document(uid).get().await()
        return Player(
            id = uid,
            name = doc.getString("name") ?: "Unknown",
            elo = doc.getLong("elo")?.toInt() ?: 1200
        )
    }

    private suspend fun savePlayerToFirestore(player: Player) {
        firestore.collection("players").document(player.id).set(
            mapOf(
                "name" to player.name,
                "elo" to player.elo
            )
        ).await()
    }
}