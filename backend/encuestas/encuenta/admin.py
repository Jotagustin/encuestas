from django.contrib import admin
from .models import Pregunta
from django.contrib import admin


@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ('id', 'codigo', 'usuario', 'empresa', 'categoria', 'estado', 'created_at')
    list_filter = ('categoria', 'estado', 'created_at')
    search_fields = ('usuario', 'pregunta', 'empresa', 'codigo')
    readonly_fields = ('codigo', 'created_at', 'updated_at')



