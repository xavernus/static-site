<?php

	$post = json_decode(file_get_contents('php://input'));
	$date = date('Y.m.d H:i:s', time());

	if($post->type == 0) {

		file_put_contents($_SERVER['DOCUMENT_ROOT'].'/history.txt', 'Начало воспроизведения '.$date.' - '.$post->track.' - '.$post->played."\n", FILE_APPEND);
	} else {

		file_put_contents($_SERVER['DOCUMENT_ROOT'].'/history.txt', ' Конец воспроизведения '.$date.' - '.$post->track.' - '.$post->played."\n", FILE_APPEND);
	}
	
?>