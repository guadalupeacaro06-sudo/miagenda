package com.ejemplo.miagenda

import android.app.DatePickerDialog
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
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

data class Actividad(
    val id: Long,
    val titulo: String,
    val fecha: String,
    val completada: Boolean = false
)

fun obtenerFechaHoy(): String {
    val formato = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
    return formato.format(Date())
}

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
    val contexto = LocalContext.current
    val fechaHoy = remember { obtenerFechaHoy() }

    var textoActividad by remember { mutableStateOf("") }
    var fechaSeleccionada by remember { mutableStateOf("") }
    var mensajeError by remember { mutableStateOf<String?>(null) }
    var textoBusqueda by remember { mutableStateOf("") }
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }

    val actividades = remember {
        mutableStateListOf(
            Actividad(id = 1L, titulo = "Repasar apuntes de clase", fecha = fechaHoy, completada = false),
            Actividad(id = 2L, titulo = "Organizar tareas de la semana", fecha = fechaHoy, completada = true)
        )
    }

    fun abrirSelectorFecha(fechaInicial: String, onFechaElegida: (String) -> Unit) {
        val calendario = Calendar.getInstance()
        val partes = fechaInicial.split("/")
        if (partes.size == 3) {
            val dia = partes[0].toIntOrNull()
            val mes = partes[1].toIntOrNull()
            val anio = partes[2].toIntOrNull()
            if (dia != null && mes != null && anio != null) {
                calendario.set(anio, mes - 1, dia)
            }
        }
        DatePickerDialog(
            contexto,
            { _, year, month, dayOfMonth ->
                val formateada = String.format(
                    Locale.getDefault(),
                    "%02d/%02d/%04d",
                    dayOfMonth,
                    month + 1,
                    year
                )
                onFechaElegida(formateada)
            },
            calendario.get(Calendar.YEAR),
            calendario.get(Calendar.MONTH),
            calendario.get(Calendar.DAY_OF_MONTH)
        ).show()
    }

    fun agregarActividad() {
        val tituloLimpio = textoActividad.trim()
        if (tituloLimpio.isEmpty()) {
            mensajeError = "Por favor, escribe una actividad antes de agregarla."
            return
        }
        val fechaFinal = fechaSeleccionada.ifBlank { obtenerFechaHoy() }
        actividades.add(
            0,
            Actividad(
                id = System.currentTimeMillis(),
                titulo = tituloLimpio,
                fecha = fechaFinal,
                completada = false
            )
        )
        textoActividad = ""
        fechaSeleccionada = ""
        mensajeError = null
    }

    val actividadesFiltradas = actividades.filter {
        val consulta = textoBusqueda.trim()
        consulta.isEmpty() || it.titulo.contains(consulta, ignoreCase = true)
    }

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
            // Campo para escribir una actividad con validación
            OutlinedTextField(
                value = textoActividad,
                onValueChange = {
                    textoActividad = it
                    if (it.isNotBlank()) mensajeError = null
                },
                label = { Text("Escribe una actividad") },
                isError = mensajeError != null,
                supportingText = mensajeError?.let { msg -> { Text(text = msg) } },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Selector de fecha (por defecto hoy)
            OutlinedButton(
                onClick = {
                    abrirSelectorFecha(fechaSeleccionada.ifBlank { fechaHoy }) { elegida ->
                        fechaSeleccionada = elegida
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null,
                    modifier = Modifier.padding(end = 8.dp)
                )
                Text(
                    text = if (fechaSeleccionada.isBlank()) {
                        "Fecha: Hoy ($fechaHoy)"
                    } else {
                        "Fecha: $fechaSeleccionada"
                    }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Button(
                onClick = { agregarActividad() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                Text(text = "Agregar actividad")
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Barra de búsqueda en tiempo real encima de la lista
            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                placeholder = { Text("Buscar actividad por nombre...") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Buscar"
                    )
                },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Limpiar búsqueda"
                            )
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            if (actividadesFiltradas.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (actividades.isEmpty()) {
                            "No hay actividades todavía. Escribe una arriba."
                        } else {
                            "No se encontraron actividades con ese nombre."
                        },
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
                        items = actividadesFiltradas,
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
                            onEditar = {
                                actividadEnEdicion = actividad
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

    // Diálogo sencillo para editar nombre y fecha
    actividadEnEdicion?.let { item ->
        var tituloEditado by remember(item.id) { mutableStateOf(item.titulo) }
        var fechaEditada by remember(item.id) { mutableStateOf(item.fecha) }
        var errorEdicion by remember(item.id) { mutableStateOf<String?>(null) }

        AlertDialog(
            onDismissRequest = { actividadEnEdicion = null },
            title = { Text("Editar actividad") },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedTextField(
                        value = tituloEditado,
                        onValueChange = {
                            tituloEditado = it
                            if (it.isNotBlank()) errorEdicion = null
                        },
                        label = { Text("Nombre de la actividad") },
                        isError = errorEdicion != null,
                        supportingText = errorEdicion?.let { msg -> { Text(msg) } },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedButton(
                        onClick = {
                            abrirSelectorFecha(fechaEditada) { elegida ->
                                fechaEditada = elegida
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(
                            imageVector = Icons.Default.DateRange,
                            contentDescription = null,
                            modifier = Modifier.padding(end = 8.dp)
                        )
                        Text("Fecha: $fechaEditada")
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val tituloLimpio = tituloEditado.trim()
                        if (tituloLimpio.isEmpty()) {
                            errorEdicion = "Por favor, escribe un nombre válido."
                            return@Button
                        }
                        val indice = actividades.indexOfFirst { it.id == item.id }
                        if (indice != -1) {
                            actividades[indice] = item.copy(
                                titulo = tituloLimpio,
                                fecha = fechaEditada.ifBlank { obtenerFechaHoy() }
                            )
                        }
                        actividadEnEdicion = null
                    }
                ) {
                    Text("Guardar")
                }
            },
            dismissButton = {
                TextButton(onClick = { actividadEnEdicion = null }) {
                    Text("Cancelar")
                }
            }
        )
    }
}

@Composable
fun ActividadItem(
    actividad: Actividad,
    onToggleCompletada: () -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = { onToggleCompletada() }
            )

            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            ) {
                Text(
                    text = actividad.titulo,
                    style = MaterialTheme.typography.bodyLarge,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    }
                )
                Text(
                    text = "Fecha: ${actividad.fecha}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            IconButton(onClick = onEditar) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Editar actividad"
                )
            }

            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad"
                )
            }
        }
    }
}
