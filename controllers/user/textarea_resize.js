// объект события ввода, высота строки текста и минимальное число строк
function textarea_resize(event, line_height, min_line_count)
{
// минимаьная высота
var min_line_height = min_line_count * line_height;
// цель ивента
var obj = event.target;
// берем дополнительный слов
var div = document.getElementById(obj.id + '_div');
// записываем текст
div.innerHTML = obj.value;
// определяем высоту
var obj_height = div.offsetHeight;
// если нажали enter
if (event.keyCode == 13)
// увеличиваем высоту
obj_height += line_height;
// иначе есои высота меньше минимальной
else if (obj_height < min_line_height)
// приравниваем к ней
obj_height = min_line_height;
// высота самого textarea
obj.style.height = obj_height + 'px';
}