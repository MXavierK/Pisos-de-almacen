# Pisos-de-almacen
Asignación de pedidos en los pisos de un almacén


Consideraciones:
El proyecto esta listo para funcionar, por el momento tiene ejemplos con JSON que deben ser remplazados por los servicios:
1.GET lista de pisos que contienen pedidos para mostralos.
2.GET lista de pedidos disponibles para asignación
3.POST de la asignación de pedidos a pisos.

Aun que el proyecto esta listo para funcionar, como se deja actualmente sin servicios y solo JSON unicamente podrá simular el funncionamiento exceptuando la asignación que en su lugar se muestra un alert con los datos que se estarían asignando.

Funcionamiento una vez que se tienen los servicios:
1.Cuando se inicia obtendrá los pisos que tienen pedidos asignados mostrandolos, estos se marcaran en color verde.
2.Puede asignar nuevos pedidos a un piso vacio o a un piso que ya cuente con pedidos asignados dandole clck al piso.
3.Los pedidos ya asignados a pisos dejaran de aparecer en el modal, sin embargo, cuando un pedido es grande requerira de 2 pisos por lo que puede asignarse a un nuevo piso "arrastrando" el piso a un piso destino.
Nota: Esto solo funcionara cuando el piso donde se encuentra el pedido que asignara a otro piso solo cuenta con 1 pedido, si tiene mas no deberá funcionar. 
