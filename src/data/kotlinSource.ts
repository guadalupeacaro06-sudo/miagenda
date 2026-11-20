export const KOTLIN_MAIN_ACTIVITY = `package com.ejemplo.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp

// Modelo simple para representar cada actividad en memoria
data class Actividad(
    val id: Long,
    val titulo: String,
    val completada: Boolean = false
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MiAgendaScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaScreen() {
    // 1. Estado del texto que escribe el alumno
    var textoActividad by remember { mutableStateOf("") }

    // 2. Lista de actividades en memoria (dura mientras la app esté abierta)
    val actividades = remember {
        mutableStateListOf(
            Actividad(id = 1L, titulo = "Repasar cómo funciona Column y Row", completada = false),
            Actividad(id = 2L, titulo = "Crear mi primera pantalla en Compose", completada = true)
        )
    }

    // Función sencilla para agregar una nueva actividad
    fun agregarActividad() {
        val tituloLimpio = textoActividad.trim()
        if (tituloLimpio.isNotEmpty()) {
            actividades.add(
                0,
                Actividad(
                    id = System.currentTimeMillis(),
                    titulo = tituloLimpio,
                    completada = false
                )
            )
            textoActividad = ""
        }
    }

    // Scaffold organiza la barra superior y el contenido principal
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Mi Agenda") }
            )
        }
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(16.dp)
        ) {
            // Campo para escribir una nueva actividad
            OutlinedTextField(
                value = textoActividad,
                onValueChange = { textoActividad = it },
                label = { Text("Escribe una actividad") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Botón grande y claro para agregar la actividad
            Button(
                onClick = { agregarActividad() },
                enabled = textoActividad.isNotBlank(),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(text = "Agregar actividad")
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Lista donde aparecen las actividades agregadas
            if (actividades.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No hay actividades todavía. Escribe una arriba.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(bottom = 16.dp)
                ) {
                    items(
                        items = actividades,
                        key = { it.id }
                    ) { actividad ->
                        ActividadItem(
                            actividad = actividad,
                            onToggleCompletada = {
                                val indice = actividades.indexOfFirst { it.id == actividad.id }
                                if (indice != -1) {
                                    actividades[indice] = actividad.copy(
                                        completada = !actividad.completada
                                    )
                                }
                            },
                            onEliminar = {
                                actividades.removeAll { it.id == actividad.id }
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ActividadItem(
    actividad: Actividad,
    onToggleCompletada: () -> Unit,
    onEliminar: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Control para marcar como completada
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = { onToggleCompletada() }
            )

            // Nombre de la actividad (se tacha si está completada)
            Text(
                text = actividad.titulo,
                style = MaterialTheme.typography.bodyLarge,
                textDecoration = if (actividad.completada) {
                    TextDecoration.LineThrough
                } else {
                    TextDecoration.None
                },
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            )

            // Botón para eliminar la actividad
            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad"
                )
            }
        }
    }
}`;
