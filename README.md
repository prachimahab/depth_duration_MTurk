# Perceiving Object Distances in Briefly-Glimpsed Pictured Scenes

Based on prior work in this field, we hypothesize that human visual distance perception in pictured scenes optimally integrates visual distance cues with temporal processing differences. To that end, we aim to answer two core questions: (1) How does bias and sensitivity in verbal estimates of egocentric distance in pictures change as viewing duration increases? (2) At what time point is the distance representation fully developed? 

Method: We will present images with targets at variable distances from the SUN RGB-D database and have participants make egocentric distance estimations. Specifically, master workers from Amazon’s Mechanical Turk will judge distances to a red target placed in the vertical midline of the image in either feet or meters. Duration (250 ms, 500 ms, 750 ms, or 1000 ms) will be manipulated within subjects.  Sixty four targets ranging in distance between 1m - 5m will be presented at each duration, with equal representation of distances in each duration (256 images total). 

# What does this repository contain? 
The data will be collected online through Amazon's Mechanical Turk so the repository contains basic web development files. The Apache server was used to run the experiment, and needs to be configured to allow for CORS in order for the web content to load. 
- The main files for running the experiment are DepthDuration_CSS.css, DepthDuration_JS.js, and DepthDuration_HTML.html 
- The data is logged and saved as a CSV on the server in saveFile.php
- Participants receive an unique completion code via revealCode.html 
- depthDuration_source.html is adapted source code provided by Amazon Mechanical Turk for providing instructions and setting the survey link 
- depth_duration_variables.csv contains the variables that are needed for depthDuration_source.html (e.g. survey link). This method allows experimenters to publish a batch of multiple HITs (Human Intelligence Task) on Mechanical Turk

In order to maximize image variability across participants, unique trial sequences were made using SUN-RGBD images. All images in the dataset were taken with Kinectv2 sensors, so the “ground truth” distance of the targets was extracted from the depth array for each image in the SUN-RGBD dataset. The following files allow for a balanced design in terms of images, duration, and range of target distances. 
- The folder V0_jsons contains the four possible trial structures for participants. Given that there is no image repetition, four unique trial sequences was the maximum number possible given dataset constraints. Each json file contains the duration, image path, and masking image path for each trial, for a total of 256 trials.
- Participants were given a few practice trials to acclimate themselves to the experiment. The file practice_data.json reflects the trial structure for these trials.
- Image files: example.png (sample scene from SUN-RGBD) & fixation.jpg (standard fixation image) 
- counterbalancing.csv is a file that is referenced in DepthDuration_JS.js to select the correct trial sequence (JSON file) for a given HIT 

Note: Given the sheer size of the image dataset used (1,024 unique images, and 1,024 unique colored masks), image files are not currently included. All images however are available at https://rgbd.cs.princeton.edu/.

# Citations:

S. Song, S. Lichtenberg, and J. Xiao.
SUN RGB-D: A RGB-D Scene Understanding Benchmark Suite
Proceedings of 28th IEEE Conference on Computer Vision and Pattern Recognition (CVPR2015)
