preview:
	rsync --exclude '.git' --exclude '*node_modules*' -ave ssh . clabzcom@c4labz.com:~/public_html/frenchelevators/

screenshot:
	echo `date` >> ./ffmpeg.log
	find ./videos/ -iname '*.mp4' -print0 | \
	xargs -0 -n1 -I% ffmpeg -i %  -r  1  -t  1 %.jpg

opt-png:
	# Optimizes png files
	echo `date` >> ./optipng.log
	find ./images/ -iname '*.png' -print0 | \
	xargs -0 optipng -o7 -preserve >> ./optipng.log

opt-jpg:
	# Optimizes jpg files keeping EXIF data
	echo `date` >> ./jpegoptim.log
	find ./images/ -iname '*.jpg' -print0 | \
	 xargs -0 jpegoptim --max=90 --preserve --totals --all-progressive >> ./jpegoptim.log
