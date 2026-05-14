import natural from 'natural';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const classifier = new natural.BayesClassifier(natural.PorterStemmerEs);

const trainData = [
  // POSITIVOS
  { text: 'Excelente producto, me encanta', label: 'positive' },
  { text: 'Muy buena calidad, lo recomiendo', label: 'positive' },
  { text: 'Es asombroso y funciona perfecto', label: 'positive' },
  { text: 'Estoy muy feliz con esta compra', label: 'positive' },
  { text: 'Maravilloso, superó mis expectativas', label: 'positive' },
  { text: 'Qué buen trabajo, me gusta mucho', label: 'positive' },
  { text: 'Excelente servicio, muy rápido', label: 'positive' },
  { text: 'bueno buena genial fantástico increíble hermoso', label: 'positive' },
  { text: 'me fascina perfecto satisfecho', label: 'positive' },
  { text: 'absolutamente fantástico', label: 'positive' },
  { text: '¡Este producto es increíble! Me encanta muchísimo', label: 'positive' },
  { text: 'La mejor compra que he hecho', label: 'positive' },
  { text: 'Excelente atención al cliente', label: 'positive' },
  { text: 'lo recomendaría a mis amigos', label: 'positive' },
  { text: '¡Perfecto! Exactamente lo que necesitaba', label: 'positive' },
  { text: 'Me gusta mucho el diseño, es muy elegante', label: 'positive' },
  { text: 'Estoy enamorado de este artículo, lo uso a diario', label: 'positive' },
  { text: 'El envío fue súper rápido, estoy satisfecho', label: 'positive' },
  { text: 'Fantástico, superó todas mis expectativas', label: 'positive' },
  { text: 'Buena relación calidad-precio, estoy conforme', label: 'positive' },
  { text: 'Me encanta la textura y los materiales son buenos', label: 'positive' },
  { text: 'Es tal cual se describe en la página, muy bien', label: 'positive' },
  { text: 'Increíble rendimiento, funciona a la perfección', label: 'positive' },
  { text: 'Definitivamente volveré a comprar, excelente calidad', label: 'positive' },
  { text: 'El funcionamiento es muy intuitivo y rápido', label: 'positive' },
  { text: 'Estoy muy feliz con la compra, todo excelente', label: 'positive' },
  { text: 'Maravilloso, se lo recomendaré a toda mi familia', label: 'positive' },
  { text: 'Me llegó en perfectas condiciones, muy buen servicio', label: 'positive' },
  { text: 'Súper recomendado, es de las mejores compras del año', label: 'positive' },
  { text: 'El tamaño es perfecto y el material resistente', label: 'positive' },
  { text: 'Buen producto, lo uso en el trabajo y va bien', label: 'positive' },
  { text: 'Esta excelente', label: 'positive' },
  { text: 'muy bien hecho', label: 'positive' },
  { text: 'Esta bien hecho', label: 'positive' },
  { text: 'Buenísimo, recomendado', label: 'positive' },
  
  // PALABRAS CLAVE DIRECTAS (Para forzar peso positivo)
  { text: 'bien', label: 'positive' },
  { text: 'muy bien', label: 'positive' },
  { text: 'todo bien', label: 'positive' },
  { text: 'ok', label: 'positive' },
  { text: 'fenomenal', label: 'positive' },
  { text: 'esta fenomenal', label: 'positive' },
  { text: 'super', label: 'positive' },
  { text: 'genial', label: 'positive' },
  { text: 'agradable', label: 'positive' },
  { text: 'feliz', label: 'positive' },
  { text: 'justo', label: 'positive' },
  { text: 'delicioso', label: 'positive' },
  { text: 'sin problemas', label: 'positive' },
  { text: 'resolvió', label: 'positive' },
  { text: 'resuelto', label: 'positive' },
  { text: 'excelente', label: 'positive' },
  { text: 'gusto', label: 'positive' },
  { text: 'gustó', label: 'positive' },
  { text: 'me gusto', label: 'positive' },
  { text: 'me gustó', label: 'positive' },
  { text: 'encantó', label: 'positive' },
  { text: 'agradó', label: 'positive' },
  { text: 'buen servicio', label: 'positive' },
  { text: 'rápido', label: 'positive' },
  { text: 'rapido', label: 'positive' },
  { text: '10/10', label: 'positive' },
  { text: '10', label: 'positive' },
  { text: 'perfecto', label: 'positive' },
  
  // SLANG Y EXPRESIONES COLOMBIANAS POSITIVAS
  { text: 'que epico', label: 'positive' },
  { text: 'epico', label: 'positive' },
  { text: 'una chimba', label: 'positive' },
  { text: 're chimba', label: 'positive' },
  { text: 'que elegancia', label: 'positive' },
  { text: 'melos', label: 'positive' },
  { text: 'firme socio', label: 'positive' },
  { text: 'severo', label: 'positive' },

  // NEGATIVOS
  { text: 'Terrible calidad, se rompió rápido', label: 'negative' },
  { text: 'No me gusta, es un mal producto', label: 'negative' },
  { text: 'Pésimo servicio, muy decepcionado', label: 'negative' },
  { text: 'No lo recomiendo para nada', label: 'negative' },
  { text: 'Una pérdida de dinero, es basura', label: 'negative' },
  { text: 'Horrible, me arrepiento de comprarlo', label: 'negative' },
  { text: 'Llegó roto y defectuoso', label: 'negative' },
  { text: 'malo mala mal pésimo terrible', label: 'negative' },
  { text: 'odio venganza triste decepción asqueroso peor', label: 'negative' },
  { text: 'la comida esta mala', label: 'negative' },
  { text: 'Terrible experiencia, una pérdida de dinero', label: 'negative' },
  { text: 'Muy decepcionado con la calidad', label: 'negative' },
  { text: 'Horrible, la peor decisión que pude tomar', label: 'negative' },
  { text: 'Asqueroso, odio esto', label: 'negative' },
  { text: 'Decepcionante y muy caro para lo que ofrece', label: 'negative' },
  { text: 'Pésima experiencia de principio a fin', label: 'negative' },
  { text: 'Se rompió al segundo día de uso, terrible', label: 'negative' },
  { text: 'Llegó roto y el vendedor no responde, pésimo servicio', label: 'negative' },
  { text: 'No sirve para nada, es una estafa completa', label: 'negative' },
  { text: 'Pésimo empaque, todo llegó aplastado', label: 'negative' },
  { text: 'Un completo desastre, no lo compren por favor', label: 'negative' },
  { text: 'No me gustó el color, es diferente al de la foto', label: 'negative' },
  { text: 'Malo, malo, malo. No pierdan su tiempo', label: 'negative' },
  { text: 'Basura total, se descompuso de inmediato', label: 'negative' },
  { text: 'Odio este producto, la peor marca de todas', label: 'negative' },
  { text: 'No funciona bien, se traba constantemente', label: 'negative' },
  { text: 'Un asco, huele raro y los acabados son pésimos', label: 'negative' },
  { text: 'Decepcionado, el manual es incomprensible', label: 'negative' },
  { text: 'Esta remal', label: 'negative' },
  { text: 're mal', label: 'negative' },
  { text: 'muy mal hecho', label: 'negative' },
  { text: 'no sirve para nada', label: 'negative' },
  
  // PALABRAS CLAVE DIRECTAS NEGATIVAS
  { text: 'aburrida', label: 'negative' },
  { text: 'aburrido', label: 'negative' },
  { text: 'problema', label: 'negative' },
  { text: 'no resolvió', label: 'negative' },
  { text: 'frustrado', label: 'negative' },
  { text: 'frustrante', label: 'negative' },
  { text: 'tardaron', label: 'negative' },
  { text: 'tardó', label: 'negative' },
  { text: 'lento', label: 'negative' },
  { text: 'enojado', label: 'negative' },
  { text: 'estoy enojado', label: 'negative' },
  { text: 'estoy muy enojado', label: 'negative' },
  { text: 'molesto', label: 'negative' },
  { text: 'estoy molesto', label: 'negative' },
  { text: 'furioso', label: 'negative' },
  { text: 'nervios', label: 'negative' },
  { text: 'nervioso', label: 'negative' },
  { text: 'miedo', label: 'negative' },
  { text: 'susto', label: 'negative' },

  // SLANG Y EXPRESIONES COLOMBIANAS NEGATIVAS
  { text: 'que video tan re paila socio', label: 'negative' },
  { text: 're paila', label: 'negative' },
  { text: 'paila', label: 'negative' },
  { text: 'que video tan malo', label: 'negative' },
  { text: 'gonorrea', label: 'negative' },
  { text: 'que gorrea', label: 'negative' },
  { text: 'que picho', label: 'negative' },
  { text: 'picho', label: 'negative' },
  { text: 'una porqueria', label: 'negative' },
  { text: 'que basura', label: 'negative' },
  { text: 'asqueroso', label: 'negative' },

  // NEUTRALES (Limpiados de palabras positivas)
  { text: 'Es aceptable, cumple su función', label: 'neutral' },
  { text: 'No está mal, pero podría ser mejor', label: 'neutral' },
  { text: 'Producto promedio, nada especial', label: 'neutral' },
  { text: 'Llegó en su caja, es lo que esperaba', label: 'neutral' },
  { text: 'Funciona de manera normal', label: 'neutral' },
  { text: 'Normal, ni fu ni fa', label: 'neutral' },
  { text: 'Lo uso a diario', label: 'neutral' },
  { text: 'regular promedio aceptable', label: 'neutral' },
  { text: 'mas o menos', label: 'neutral' },
  { text: 'Producto decente para el precio', label: 'neutral' },
  { text: 'Producto decente', label: 'neutral' },
  { text: 'Pasable, nada especial', label: 'neutral' },
  { text: 'Producto promedio, hace lo que dice', label: 'neutral' },
  { text: 'Cumple su función, pero podría ser mejor', label: 'neutral' },
  { text: 'Es un producto aceptable, no destaca', label: 'neutral' },
  { text: 'Más o menos, he visto mejores opciones en el mercado', label: 'neutral' },
  { text: 'Es regular, esperaba un poco más de este modelo', label: 'neutral' },
  { text: 'Todo bien por ahora, el producto es funcional', label: 'neutral' },
  { text: 'Normal, ni excelente ni terrible', label: 'neutral' },
  { text: 'No está mal, lo recomendaría a medias', label: 'neutral' },
  { text: 'Sorprendentemente bueno para ser tan económico', label: 'neutral' },
  { text: 'buenos dias', label: 'neutral' },
  { text: 'buenas tardes', label: 'neutral' },
  { text: 'hola', label: 'neutral' },
  { text: 'un saludo', label: 'neutral' },
  { text: 'que mas', label: 'neutral' },
  { text: 'ahi mas o menos', label: 'neutral' },
  { text: 'todo normal', label: 'neutral' },
  { text: 'raro', label: 'neutral' },
  { text: 'empatado', label: 'neutral' },

  // === EJEMPLOS ADICIONALES - NEUTRALES (para balancear el dataset) ===
  // Reseñas neutrales de productos
  { text: 'El producto llegó en el tiempo estimado', label: 'neutral' },
  { text: 'La caja venía un poco golpeada pero el producto está bien', label: 'neutral' },
  { text: 'El color no es exactamente igual a la foto', label: 'neutral' },
  { text: 'El tamaño es adecuado para lo que necesito', label: 'neutral' },
  { text: 'Viene con sus accesorios básicos', label: 'neutral' },
  { text: 'Lo compré por el precio, no esperaba mucho', label: 'neutral' },
  { text: 'Es un producto genérico, hace su trabajo', label: 'neutral' },
  { text: 'Tiene buena pinta pero aún no lo he probado bien', label: 'neutral' },
  { text: 'Es la primera vez que lo compro, veremos cómo resulta', label: 'neutral' },
  { text: 'Me lo recomendó un amigo, estoy probándolo', label: 'neutral' },
  { text: 'El diseño es sencillo pero funcional', label: 'neutral' },
  { text: 'No es lo mejor pero tampoco lo peor que he comprado', label: 'neutral' },
  { text: 'El material se ve resistente aunque el acabado es regular', label: 'neutral' },
  { text: 'Llevo una semana usándolo y todo normal', label: 'neutral' },
  { text: 'Es justo lo que aparece en la descripción', label: 'neutral' },
  { text: 'La relación calidad precio está equilibrada', label: 'neutral' },
  { text: 'Por ahora funciona bien, actualizaré después', label: 'neutral' },
  { text: 'Vamos a ver qué tal, por ahora bien', label: 'neutral' },
  { text: 'Bueno bonito y barato como dicen', label: 'neutral' },
  { text: 'Pues ahí va, no está mal', label: 'neutral' },

  // Comentarios neutrales de servicio
  { text: 'Me atendieron en unos 10 minutos', label: 'neutral' },
  { text: 'El asesor fue neutral, ni amable ni grosero', label: 'neutral' },
  { text: 'Solicité información y me la dieron', label: 'neutral' },
  { text: 'El trámite fue estándar, sin complicaciones', label: 'neutral' },
  { text: 'Hice la devolución sin problema', label: 'neutral' },
  { text: 'El proceso es sencillo, nada del otro mundo', label: 'neutral' },
  { text: 'Toca hacer fila pero es normal', label: 'neutral' },
  { text: 'La página web funciona sin problemas', label: 'neutral' },
  { text: 'Pude hacer el pago sin inconvenientes', label: 'neutral' },
  { text: 'Me enviaron confirmación por correo', label: 'neutral' },
  { text: 'Respondieron mi pregunta en menos de un día', label: 'neutral' },
  { text: 'La aplicación no se ha caído desde que la instalé', label: 'neutral' },
  { text: 'El proceso de registro fue simple', label: 'neutral' },
  { text: 'Navegar en el sitio es fácil', label: 'neutral' },
  { text: 'Pedí un domicilio y llegó en 30 minutos', label: 'neutral' },

  // Comentarios neutrales de comida
  { text: 'La comida estaba a temperatura ambiente', label: 'neutral' },
  { text: 'Pedí una hamburguesa normal', label: 'neutral' },
  { text: 'El restaurante estaba medio lleno', label: 'neutral' },
  { text: 'Los precios son los mismos que en otros lados', label: 'neutral' },
  { text: 'La porción es estándar', label: 'neutral' },
  { text: 'Tienen variedad de platos típicos', label: 'neutral' },
  { text: 'El ambiente es normal, nada de lujo', label: 'neutral' },
  { text: 'Comida casera sin más pretensiones', label: 'neutral' },
  { text: 'El menú del día está bien', label: 'neutral' },
  { text: 'Sirven rápido aunque la comida es simple', label: 'neutral' },

  // Comentarios neutrales - tecnología
  { text: 'El celular tiene las funciones básicas', label: 'neutral' },
  { text: 'La batería dura el día normal', label: 'neutral' },
  { text: 'La cámara es decente para el precio', label: 'neutral' },
  { text: 'Se actualizó sin problemas', label: 'neutral' },
  { text: 'El almacenamiento es suficiente para lo básico', label: 'neutral' },
  { text: 'La pantalla se ve bien en interiores', label: 'neutral' },
  { text: 'El wifi se conecta sin problema', label: 'neutral' },
  { text: 'Los audífonos suenan normal', label: 'neutral' },
  { text: 'La impresora imprime a velocidad normal', label: 'neutral' },
  { text: 'Configurarlo fue sencillo', label: 'neutral' },

  // Expresiones colombianas neutrales
  { text: 'pues ahi vamos', label: 'neutral' },
  { text: 'ahi vamos', label: 'neutral' },
  { text: 'pues normal', label: 'neutral' },
  { text: 'pasable pues', label: 'neutral' },
  { text: 'es un servicio del monton', label: 'neutral' },
  { text: 'ni fu ni fa', label: 'neutral' },
  { text: 'regularcito', label: 'neutral' },
  { text: 'no esta mal pero tampoco bien', label: 'neutral' },
  { text: 'digamos que es aceptable', label: 'neutral' },
  { text: 'me da igual la verdad', label: 'neutral' },
  { text: 'sin pena ni gloria', label: 'neutral' },
  { text: 'equis', label: 'neutral' },
  { text: 'deje asi', label: 'neutral' },
  { text: 'como asi', label: 'neutral' },
  { text: 'no entendi', label: 'neutral' },

  // === EJEMPLOS ADICIONALES - POSITIVOS ===
  // Reseñas positivas extendidas
  { text: 'Volvería a comprar sin duda alguna', label: 'positive' },
  { text: 'El envío llegó antes de lo esperado', label: 'positive' },
  { text: 'Me solucionó la vida este producto', label: 'positive' },
  { text: 'Excelente relación costo beneficio', label: 'positive' },
  { text: 'Increíble la calidad para lo que pagué', label: 'positive' },
  { text: 'Lo recomiendo a ojos cerrados', label: 'positive' },
  { text: 'Ya lo he usado varias veces y sigue como nuevo', label: 'positive' },
  { text: 'El que lo diseñó merece un aumento', label: 'positive' },
  { text: 'Servicio cinco estrellas sin duda', label: 'positive' },
  { text: 'Quedé gratamente sorprendido con la calidad', label: 'positive' },

  // Positivos de comida
  { text: 'La comida estaba deliciosa y bien servida', label: 'positive' },
  { text: 'Los sabores son auténticos, se nota ingrediente fresco', label: 'positive' },
  { text: 'El mejor restaurante que he visitado este año', label: 'positive' },
  { text: 'La atención del mesero fue magnífica', label: 'positive' },
  { text: 'La pizza llegó caliente y en su punto', label: 'positive' },
  { text: 'El postre es una delicia total', label: 'positive' },
  { text: 'Ambiente acogedor y comida espectacular', label: 'positive' },
  { text: 'Hacen el mejor café de la ciudad', label: 'positive' },
  { text: 'El desayuno estaba perfecto, volveré mañana', label: 'positive' },
  { text: 'La hamburguesa es gigante y muy sabrosa', label: 'positive' },

  // Positivos de tecnología
  { text: 'La batería dura mucho más de lo que esperaba', label: 'positive' },
  { text: 'La cámara saca fotos increíbles incluso de noche', label: 'positive' },
  { text: 'El procesador es muy rápido, no se traba nada', label: 'positive' },
  { text: 'La pantalla se ve espectacular en full HD', label: 'positive' },
  { text: 'El audio es impresionante, se escucha muy nítido', label: 'positive' },
  { text: 'Se emparejó al instante con mis audífonos', label: 'positive' },
  { text: 'La instalación fue muy intuitiva y rápida', label: 'positive' },
  { text: 'El reconocimiento facial funciona a la primera', label: 'positive' },
  { text: 'La memoria alcanza para todas mis aplicaciones', label: 'positive' },
  { text: 'El teclado es muy cómodo para escribir', label: 'positive' },

  // Positivos de servicio al cliente
  { text: 'Me resolvieron el problema en cuestión de minutos', label: 'positive' },
  { text: 'La devolución fue facilísima, sin peros', label: 'positive' },
  { text: 'El soporte técnico es de lo mejor que he visto', label: 'positive' },
  { text: 'Me hicieron un descuento extra por la espera', label: 'positive' },
  { text: 'La garantía la hicieron efectiva sin trabas', label: 'positive' },
  { text: 'Responden rapidísimo por WhatsApp', label: 'positive' },
  { text: 'Me llamaron para confirmar que todo estuviera bien', label: 'positive' },
  { text: 'Qué buen servicio postventa tienen', label: 'positive' },
  { text: 'El domiciliario fue muy amable y cuidadoso', label: 'positive' },
  { text: 'El seguimiento del pedido es muy transparente', label: 'positive' },

  // Expresiones colombianas positivas adicionales
  { text: 'que nota ese producto', label: 'positive' },
  { text: 'es una nota', label: 'positive' },
  { text: 'estuvo melo el paseo', label: 'positive' },
  { text: 'que chimba de restaurante', label: 'positive' },
  { text: 'tan bacano este celular', label: 'positive' },
  { text: 'es una berraquera', label: 'positive' },
  { text: 'que buena esa camiseta', label: 'positive' },
  { text: 'esta muy bacano', label: 'positive' },
  { text: 'espectacular parce', label: 'positive' },
  { text: 'melo parce', label: 'positive' },
  { text: 'una belleza de producto', label: 'positive' },
  { text: 'todo bien todo correcto', label: 'positive' },
  { text: 'quedo melo el arreglo', label: 'positive' },
  { text: 'esta super bien logrado', label: 'positive' },
  { text: 'que buen servicio parce', label: 'positive' },

  // Positivos cortos (reviews rápidas)
  { text: 'buen producto', label: 'positive' },
  { text: 'muy util', label: 'positive' },
  { text: 'lo mejor', label: 'positive' },
  { text: 'recomendado totalmente', label: 'positive' },
  { text: 'excelente compra', label: 'positive' },
  { text: 'me encanto', label: 'positive' },
  { text: 'cinco estrellas', label: 'positive' },
  { text: 'super recomendado', label: 'positive' },
  { text: 'vale cada peso', label: 'positive' },
  { text: 'calidad insuperable', label: 'positive' },

  // === EJEMPLOS ADICIONALES - NEGATIVOS ===
  // Reseñas negativas extendidas
  { text: 'Me arrepiento completamente de haberlo comprado', label: 'negative' },
  { text: 'No cumple con lo que promete en la publicidad', label: 'negative' },
  { text: 'El producto se dañó a los tres días de uso', label: 'negative' },
  { text: 'La calidad es infinitamente peor de lo que muestra la foto', label: 'negative' },
  { text: 'Solicité reembolso y no me han respondido', label: 'negative' },
  { text: 'Es una copia barata de lo que anuncian', label: 'negative' },
  { text: 'Vino incompleto, le faltaban piezas', label: 'negative' },
  { text: 'Gasté mi dinero en algo que no funciona', label: 'negative' },
  { text: 'La pantalla vino rayada y manchada', label: 'negative' },
  { text: 'Nunca me llegó el pedido y no hay respuesta', label: 'negative' },

  // Negativos de comida
  { text: 'La comida llegó fría y con mal aspecto', label: 'negative' },
  { text: 'Encontré un pelo en mi plato, nunca vuelvo', label: 'negative' },
  { text: 'El pollo estaba crudo por dentro', label: 'negative' },
  { text: 'La ensalada tenía las hojas marchitas', label: 'negative' },
  { text: 'Pedí sin cebolla y me la pusieron igual', label: 'negative' },
  { text: 'El jugo sabía a agua con colorante', label: 'negative' },
  { text: 'Los precios son un robo para esa calidad', label: 'negative' },
  { text: 'La carne estaba demasiado salada', label: 'negative' },
  { text: 'Se demoraron hora y media en traer el pedido', label: 'negative' },
  { text: 'El lugar estaba sucio y las mesas pegajosas', label: 'negative' },

  // Negativos de tecnología
  { text: 'El celular se recalienta con solo ver videos', label: 'negative' },
  { text: 'La batería no dura ni medio día', label: 'negative' },
  { text: 'Se apaga solo sin razón aparente', label: 'negative' },
  { text: 'El sistema operativo viene lleno de bloatware', label: 'negative' },
  { text: 'La cámara frontal es un desastre, todo pixelado', label: 'negative' },
  { text: 'El cargador dejó de funcionar a la semana', label: 'negative' },
  { text: 'Se traba jugando cualquier cosa', label: 'negative' },
  { text: 'La memoria se llena rápido y no se puede ampliar', label: 'negative' },
  { text: 'El reconocimiento de huella funciona una de cada diez veces', label: 'negative' },
  { text: 'La aplicación se crashea constantemente', label: 'negative' },

  // Negativos de servicio al cliente
  { text: 'Llamé cinco veces y nunca me solucionaron nada', label: 'negative' },
  { text: 'La persona que me atendió fue grosera y prepotente', label: 'negative' },
  { text: 'Llevo un mes esperando una respuesta', label: 'negative' },
  { text: 'Me dejaron en visto por WhatsApp y nunca respondieron', label: 'negative' },
  { text: 'Me colgaron el teléfono dos veces', label: 'negative' },
  { text: 'La garantía no sirve para nada, puros peros', label: 'negative' },
  { text: 'Ponen trabas para todo, no valen la pena', label: 'negative' },
  { text: 'Mentiras en los tiempos de entrega', label: 'negative' },
  { text: 'Hice el pago y a los dos días cancelaron el pedido sin avisar', label: 'negative' },
  { text: 'Quieren cobrar más por la devolución', label: 'negative' },

  // Expresiones colombianas negativas adicionales
  { text: 'que video tan maluco parce', label: 'negative' },
  { text: 'no valio la pena', label: 'negative' },
  { text: 'me parece una estafa', label: 'negative' },
  { text: 'que robo tan hp', label: 'negative' },
  { text: 'no gaste su plata en eso', label: 'negative' },
  { text: 'que mamera ese producto', label: 'negative' },
  { text: 'es puro humo lo que venden', label: 'negative' },
  { text: 'me tienen mamado con tanta demora', label: 'negative' },
  { text: 'que pereza este servicio', label: 'negative' },
  { text: 'me van a tener que devolver la plata', label: 'negative' },
  { text: 'que pesar haber botado la plata', label: 'negative' },
  { text: 'tan paila ese restaurante', label: 'negative' },
  { text: 'ni a palo vuelvo', label: 'negative' },
  { text: 'que visaje con esta app', label: 'negative' },
  { text: 'de malas con esta compra', label: 'negative' },

  // Negativos cortos
  { text: 'no lo recomiendo', label: 'negative' },
  { text: 'pesimo producto', label: 'negative' },
  { text: 'mala compra', label: 'negative' },
  { text: 'no funciona', label: 'negative' },
  { text: 'me arrepiento', label: 'negative' },
  { text: 'estafa total', label: 'negative' },
  { text: 'perdida de dinero', label: 'negative' },
  { text: 'una basura', label: 'negative' },
  { text: 'decepcion total', label: 'negative' },
  { text: 'no vale la pena', label: 'negative' },

  // === TERCERA RONDA: MÁS EJEMPLOS PARA LLEGAR A 500+ ===
  // Más neutrales (refuerzo de la clase más débil)
  { text: 'La aplicación abre y cierra normal', label: 'neutral' },
  { text: 'Me inscribí al curso y ya', label: 'neutral' },
  { text: 'Es martes y no ha pasado nada raro', label: 'neutral' },
  { text: 'El bus pasó a la hora de siempre', label: 'neutral' },
  { text: 'Compré lo mismo de siempre', label: 'neutral' },
  { text: 'La nevera funciona sin hacer ruido', label: 'neutral' },
  { text: 'La silla aguanta bien', label: 'neutral' },
  { text: 'Las zapatillas son cómodas pero nada del otro mundo', label: 'neutral' },
  { text: 'La camisa es de algodón normal', label: 'neutral' },
  { text: 'La lámpara alumbra, es lo importante', label: 'neutral' },
  { text: 'El libro tiene 200 páginas', label: 'neutral' },
  { text: 'La película dura dos horas', label: 'neutral' },
  { text: 'El vuelo salió a tiempo', label: 'neutral' },
  { text: 'Llegué a la cita médica puntual', label: 'neutral' },
  { text: 'Me tocó esperar 20 minutos', label: 'neutral' },
  { text: 'El clima está normal para la época', label: 'neutral' },
  { text: 'Hace un día soleado', label: 'neutral' },
  { text: 'Está lloviendo desde temprano', label: 'neutral' },
  { text: 'La temperatura está agradable', label: 'neutral' },
  { text: 'Hay tráfico pero nada grave', label: 'neutral' },
  { text: 'La carretera está en buen estado', label: 'neutral' },
  { text: 'Me queda a 15 minutos de la casa', label: 'neutral' },
  { text: 'Hay parqueadero disponible', label: 'neutral' },
  { text: 'Aceptan todas las tarjetas', label: 'neutral' },
  { text: 'Los precios aparecen en dólares y pesos', label: 'neutral' },
  { text: 'La página carga en unos segundos', label: 'neutral' },
  { text: 'Me registré con mi correo electrónico', label: 'neutral' },
  { text: 'Puedo ver mi historial de pedidos', label: 'neutral' },
  { text: 'La silla de ruedas cabe en el ascensor', label: 'neutral' },
  { text: 'El edificio tiene dos ascensores', label: 'neutral' },
  { text: 'La oficina está en el tercer piso', label: 'neutral' },
  { text: 'Hay un parqueadero de bicicletas', label: 'neutral' },
  { text: 'La ruta del bus pasa cada 20 minutos', label: 'neutral' },
  { text: 'Llamé y me contestó una grabadora', label: 'neutral' },
  { text: 'Me pasaron con otra persona', label: 'neutral' },

  // Más positivas
  { text: 'Qué maravilla de atención al cliente tienen', label: 'positive' },
  { text: 'Los asesores son un amor de personas', label: 'positive' },
  { text: 'Desde que llegué me hicieron sentir en casa', label: 'positive' },
  { text: 'Detalles como estos hacen la diferencia', label: 'positive' },
  { text: 'El empaque de regalo es precioso', label: 'positive' },
  { text: 'Me incluyeron una muestra gratis de otro producto', label: 'positive' },
  { text: 'La presentación es impecable', label: 'positive' },
  { text: 'Huele delicioso, es un aroma natural', label: 'positive' },
  { text: 'La textura de la crema es suave y se absorbe rápido', label: 'positive' },
  { text: 'Mejor que las marcas caras del mercado', label: 'positive' },
  { text: 'Pensé que no me iba a gustar y terminé fascinado', label: 'positive' },
  { text: 'Gratamente sorprendido con los resultados', label: 'positive' },
  { text: 'Compré uno para mi mamá y le encantó', label: 'positive' },
  { text: 'Los niños están felices con sus juguetes nuevos', label: 'positive' },
  { text: 'Perfecto para regalar en cualquier ocasión', label: 'positive' },
  { text: 'La calidad supera por mucho a la competencia', label: 'positive' },
  { text: 'Invertí en esto y fue la mejor decisión', label: 'positive' },
  { text: 'No me cansaré de recomendarlo', label: 'positive' },
  { text: 'Una experiencia de compra impecable de inicio a fin', label: 'positive' },
  { text: 'Definitivamente se ganaron un cliente fiel', label: 'positive' },
  { text: 'súper chévere ese sitio', label: 'positive' },
  { text: 'me encantó todo, es perfecto', label: 'positive' },
  { text: 'llegó rapidísimo, en menos de 24 horas', label: 'positive' },
  { text: 'calidad precio insuperable', label: 'positive' },
  { text: 'la mejor inversión que he hecho este año', label: 'positive' },

  // Más negativas
  { text: 'Vergüenza ajena me dio comprar esto', label: 'negative' },
  { text: 'El peor gasto que he hecho en años', label: 'negative' },
  { text: 'Sigo esperando mi pedido, ya van 15 días', label: 'negative' },
  { text: 'Me enviaron otro producto diferente al que compré', label: 'negative' },
  { text: 'El color es totalmente distinto, naranja fosforescente en vez de beige', label: 'negative' },
  { text: 'Las costuras se descosieron al primer lavado', label: 'negative' },
  { text: 'Encogió dos tallas después de lavarlo en frío', label: 'negative' },
  { text: 'La tela pica horrible, no se puede usar', label: 'negative' },
  { text: 'El cierre se trabó y no hay forma de abrirlo', label: 'negative' },
  { text: 'Los botones se cayeron a los dos días', label: 'negative' },
  { text: 'Entré a la página y está caída todo el tiempo', label: 'negative' },
  { text: 'No se puede pagar con tarjeta de crédito', label: 'negative' },
  { text: 'Bloquearon mi cuenta sin explicación', label: 'negative' },
  { text: 'Me robaron los datos de la tarjeta en esa página', label: 'negative' },
  { text: 'Puras mentiras, lo que venden no existe', label: 'negative' },
  { text: 'Fui hasta la tienda física y estaba cerrada', label: 'negative' },
  { text: 'La dirección que dan en maps es falsa', label: 'negative' },
  { text: 'Llevo tres meses esperando el repuesto', label: 'negative' },
  { text: 'Los repuestos que venden no son originales', label: 'negative' },
  { text: 'Dejó de funcionar justo después de la garantía', label: 'negative' },
  { text: 'Mejor quédese con su plata y compre otra cosa', label: 'negative' },
  { text: 'terrible experiencia de compra', label: 'negative' },
  { text: 'el peor servicio al cliente del mundo', label: 'negative' },
  { text: 'ojala pudiera poner cero estrellas', label: 'negative' },
  { text: 'se demoran una eternidad en entregar', label: 'negative' },

  // === CUARTA RONDA: AJUSTE FINAL PARA 500+ ===
  // Refuerzo neutral con ejemplos de conversación cotidiana
  { text: 'todavia no lo he usado', label: 'neutral' },
  { text: 'no he probado todas las funciones', label: 'neutral' },
  { text: 'tengo sentimientos encontrados', label: 'neutral' },
  { text: 'es lo que hay en el mercado', label: 'neutral' },
  { text: 'tiene las tres B', label: 'neutral' },
  { text: 'el local estaba lleno pero conseguimos mesa', label: 'neutral' },
  { text: 'el pedido llegó en una caja marrón', label: 'neutral' },
  { text: 'el menú tiene opciones vegetarianas', label: 'neutral' },
  { text: 'tienen wifi gratis', label: 'neutral' },
  { text: 'se puede pagar con efectivo', label: 'neutral' },
  { text: 'abren de lunes a viernes', label: 'neutral' },
  { text: 'cierra a las 8 de la noche', label: 'neutral' },
  { text: 'hay que registrarse primero', label: 'neutral' },
  { text: 'toca descargar la aplicación', label: 'neutral' },

  // Refuerzo positivo con más variedad
  { text: 'no me arrepiento de nada', label: 'positive' },
  { text: 'sin duda lo mejor que he comprado en meses', label: 'positive' },
  { text: 'vale cada centavo invertido', label: 'positive' },
  { text: 'me cambió la vida este aparato', label: 'positive' },
  { text: 'muy por encima del promedio', label: 'positive' },
  { text: 'nunca había tenido tan buena experiencia', label: 'positive' },
  { text: 'es demasiado hermoso no puedo dejar de verlo', label: 'positive' },
  { text: 'es la envidia de mis amigos', label: 'positive' },
  { text: 'me salvó de un apuro', label: 'positive' },
  { text: 'quedó perfecto el trabajo', label: 'positive' },
  { text: 'entrega inmediata y sin costo adicional', label: 'positive' },
  { text: 'te dan seguimiento personalizado', label: 'positive' },
  { text: 'me orientaron para escoger el adecuado', label: 'positive' },

  // Refuerzo negativo con más intensidad
  { text: 'me dañaron el día con ese servicio', label: 'negative' },
  { text: 'me tienen indignado', label: 'negative' },
  { text: 'me hicieron perder el tiempo', label: 'negative' },
  { text: 'son unos irresponsables', label: 'negative' },
  { text: 'un asco de empresa', label: 'negative' },
  { text: 'no respetan al cliente', label: 'negative' },
  { text: 'se burlan de uno con esos precios', label: 'negative' },
  { text: 'es un insulto a la inteligencia', label: 'negative' },
  { text: 'mejor hubiera botado la plata a la basura', label: 'negative' },
  { text: 'ni regalado lo quiero', label: 'negative' },
  { text: 'incumplieron todo lo prometido', label: 'negative' },
  { text: 'nunca más vuelvo a comprar con ellos', label: 'negative' },
  { text: 'reporté el caso y no me han dado respuesta', label: 'negative' },
  { text: 'el producto no es ni parecido a las fotos', label: 'negative' },
];

// === FASE 1: EVALUACIÓN CON TRAIN/TEST SPLIT 80/20 ===
console.log('🧪 FASE 1: Evaluación del modelo (Train/Test Split 80/20)');

// Mezclar datos determinísticamente (seed fijo para reproducibilidad)
function shuffleArray(arr, seed = 42) {
  const result = [...arr];
  let currentIndex = result.length;
  while (currentIndex !== 0) {
    seed = (seed * 16807 + 0) % 2147483647;
    const randomIndex = Math.floor((seed / 2147483647) * currentIndex);
    currentIndex--;
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }
  return result;
}

const shuffled = shuffleArray(trainData);

// Dividir 80% train, 20% test
const splitIndex = Math.floor(shuffled.length * 0.8);
const trainSet = shuffled.slice(0, splitIndex);
const testSet = shuffled.slice(splitIndex);

console.log(`  Total ejemplos: ${trainData.length}`);
console.log(`  Train: ${trainSet.length} (${((trainSet.length / trainData.length) * 100).toFixed(1)}%)`);
console.log(`  Test: ${testSet.length} (${((testSet.length / trainData.length) * 100).toFixed(1)}%)`);

// Entrenar clasificador de evaluación solo con train set
const evalClassifier = new natural.BayesClassifier(natural.PorterStemmerEs);
trainSet.forEach(item => evalClassifier.addDocument(item.text, item.label));
evalClassifier.train();

// Evaluar en test set
let correct = 0;
const confusionMatrix = {
  positive: { positive: 0, negative: 0, neutral: 0 },
  negative: { positive: 0, negative: 0, neutral: 0 },
  neutral: { positive: 0, negative: 0, neutral: 0 },
};

testSet.forEach(item => {
  const predicted = evalClassifier.classify(item.text);
  const actual = item.label;
  if (predicted === actual) correct++;
  confusionMatrix[actual][predicted] = (confusionMatrix[actual][predicted] || 0) + 1;
});

const accuracy = correct / testSet.length;

// Calcular métricas por clase
function calcPerClass(label) {
  const tp = confusionMatrix[label][label];
  const fp = Object.keys(confusionMatrix).reduce((sum, k) => k !== label ? sum + (confusionMatrix[k][label] || 0) : sum, 0);
  const fn = Object.keys(confusionMatrix[label]).reduce((sum, k) => k !== label ? sum + (confusionMatrix[label][k] || 0) : sum, 0);
  const precision = tp / (tp + fp) || 0;
  const recall = tp / (tp + fn) || 0;
  const f1 = (2 * precision * recall) / (precision + recall) || 0;
  return { precision: Math.round(precision * 100) / 100, recall: Math.round(recall * 100) / 100, f1: Math.round(f1 * 100) / 100 };
}

const modelMetrics = {
  accuracy: Math.round(accuracy * 10000) / 10000,
  totalTestSamples: testSet.length,
  correctPredictions: correct,
  trainedAt: new Date().toISOString(),
  confusionMatrix,
  perClass: {
    positive: calcPerClass('positive'),
    negative: calcPerClass('negative'),
    neutral: calcPerClass('neutral'),
  },
};

console.log(`\n📊 Resultados de Evaluación:`);
console.log(`  ✅ Accuracy: ${(modelMetrics.accuracy * 100).toFixed(1)}%`);
console.log(`  ✅ Correctos: ${correct}/${testSet.length}`);
console.log(`\n📈 Métricas por Clase:`);
console.log(`  Positivo -> Precision: ${modelMetrics.perClass.positive.precision}, Recall: ${modelMetrics.perClass.positive.recall}, F1: ${modelMetrics.perClass.positive.f1}`);
console.log(`  Negativo -> Precision: ${modelMetrics.perClass.negative.precision}, Recall: ${modelMetrics.perClass.negative.recall}, F1: ${modelMetrics.perClass.negative.f1}`);
console.log(`  Neutral  -> Precision: ${modelMetrics.perClass.neutral.precision}, Recall: ${modelMetrics.perClass.neutral.recall}, F1: ${modelMetrics.perClass.neutral.f1}`);

// Guardar métricas del modelo
const outputDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const metricsPath = path.join(outputDir, 'model-metrics.json');
fs.writeFileSync(metricsPath, JSON.stringify(modelMetrics, null, 2));
console.log(`\n💾 Métricas guardadas en: ${metricsPath}`);

// === FASE 2: ENTRENAMIENTO FINAL CON TODOS LOS DATOS ===
console.log('\n🧠 FASE 2: Entrenamiento final con el 100% de los datos');

// Entrenar con todos los datos
trainData.forEach(item => {
  classifier.addDocument(item.text, item.label);
});

console.log('Entrenando modelo de Machine Learning en Español (Naive Bayes)...');
classifier.train();

const modelPath = path.join(outputDir, 'trained-model.json');

classifier.save(modelPath, function(err) {
    if (err) {
        console.error('Error al guardar el modelo:', err);
    } else {
        console.log('✅ Modelo entrenado con éxito. (Datos completos)');
        console.log('✅ Archivo guardado en:', modelPath);
    }
});
