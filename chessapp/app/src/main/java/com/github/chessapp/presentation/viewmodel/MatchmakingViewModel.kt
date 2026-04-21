package com.github.chessapp.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.github.chessapp.data.repository.MatchmakingRepository
import com.github.chessapp.domain.model.Game
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MatchmakingViewModel @Inject constructor(
    private val matchmakingRepository: MatchmakingRepository
) : ViewModel() {

    private val _game = MutableStateFlow<Game?>(null)
    val game: StateFlow<Game?> = _game

    init {
        observeMatches()
    }

    private fun observeMatches() {
        viewModelScope.launch {
            matchmakingRepository.observeMatches().collect { game ->
                _game.value = game
            }
        }
    }
}