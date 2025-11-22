import uuid
from django.db import models
from django.utils import timezone


def hoy():
    """Devuelve la fecha local actual (date), usable como default en DateField."""
    return timezone.localdate()


def ahora():
    """Devuelve la hora local actual (time), usable como default en TimeField."""
    return timezone.localtime().time()


class Pregunta(models.Model):

    ESTADO_ABIERTO = 'abierto'
    ESTADO_RESPONDIDO = 'respondido'
    ESTADO_CERRADO = 'cerrado'

    ESTADOS = [
        (ESTADO_ABIERTO, 'Abierto'),
        (ESTADO_RESPONDIDO, 'Respondido'),
        (ESTADO_CERRADO, 'Cerrado'),
    ]

    CATEGORIAS = [
        ('general', 'General'),
        ('soporte', 'Soporte'),
        ('facturacion', 'Facturación'),
    ]

    codigo = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    usuario = models.CharField('usuario', max_length=150)
    empresa = models.CharField('empresa', max_length=150, blank=True)
    pregunta = models.TextField('pregunta')
    respuesta = models.TextField('respuesta', blank=True, null=True)
    comentario = models.TextField('comentario', blank=True, null=True)
    categoria = models.CharField('categoria', max_length=50, choices=CATEGORIAS, default='general')


    fecha = models.DateField('fecha', default=hoy)
    hora = models.TimeField('hora', default=ahora)

    estado = models.CharField('estado', max_length=20, choices=ESTADOS, default=ESTADO_ABIERTO)
    created_at = models.DateTimeField('creado', auto_now_add=True)
    updated_at = models.DateTimeField('actualizado', auto_now=True)

    class Meta:
        verbose_name = 'Pregunta'
        verbose_name_plural = 'Preguntas'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.usuario} — {self.pregunta[:60]}"



