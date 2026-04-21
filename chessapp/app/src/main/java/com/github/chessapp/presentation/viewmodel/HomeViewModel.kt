package com.github.chessapp.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.chessapp.data.repository.AuthRepository
import com.github.chessapp.data.repository.MatchmakingRepository
import com.github.chessapp.domain.model.Player
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val matchmakingRepository: MatchmakingRepository
) : ViewModel() {

    private val _player = MutableStateFlow<Player?>(null)
    val player: StateFlow<Player?> = _player

    init {
        loadPlayer()
    }

    private fun loadPlayer() {
        viewModelScope.launch {
            _player.value = authRepository.getCurrentPlayer()
        }
    }

    fun findMatch() {
        viewModelScope.launch {
            _player.value?.let { matchmakingRepository.joinQueue(it) }
        }
    }
}