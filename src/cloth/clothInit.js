import InstancePoint from './pointsInit.js'
import InstanceSticks from './sticksInit.js'

import Point from './point.js';
import Stick from './stick.js';

export function initCloth(width, height, damping, k, scene, particleMass)
{
    let completeMesh = [];
    let points = [];
    let verticesArray = [];

    //Create points. There will be vertPerUnit number of points per unit length.
    for(let i = 0; i < width; i += 1 )
    {
        for(let j = 0; j < height; j += 1)
        {
            //points.push(new Point(i,j,0,0.5,false,damping));
            points.push(new Point(i, height, j, particleMass, false, damping));
            verticesArray.push(i, height, j);
        }
    }
    let vertices = new Float32Array(verticesArray);

    let sticks = []
    let stick;

    //Connect points with sticks
    // STRUCTURAL 
    for(let i = 0;  i < points.length; i++)
    {
        if (((i+1) % width) != 0) { //Dont connect points if they are not on the same row
            stick = new Stick(points[i], points[i+1], k);
            sticks.push(stick);
        }
         
        if (i < ((points.length-width))) { //Connect points on following row.
            stick = new Stick(points[i], points[i+width], k);
            sticks.push(stick);
        }
    }
    // stick = new Stick(points[0], points[0 + width + 1]);
    // sticks.push(stick);

    // SHEAR & FLEXION
    for(let i = 0; i <= width - 1; i++)
    {
        for(let j = 0; j < height - 1; j++)  
        {
            // SHEAR
            let idx = i + width * j;
            if(i+1 < width && j+1 < height){
                stick = new Stick(points[idx], points[idx + width + 1], k);
                sticks.push(stick);
                stick =  new Stick(points[idx + 1], points[idx + width], k);
                sticks.push(stick);
            }

            //stick = new Stick(points[idx], points[idx + width + 1], k);
            //sticks.push(stick);
            //stick =  new Stick(points[idx + 1], points[idx + width], k);
            //sticks.push(stick);

            // FLEXION
            if(i+2 <= width - 1){
                stick = new Stick(points[idx], points[idx + 2], k);
                sticks.push(stick);
            }
            if(j+2 <= height - 1){
                stick = new Stick(points[idx], points[idx + (width * 2)], k);
                sticks.push(stick);
            }
        }
    }

    //points[(width*height)-1].setAnchor();

    points[width-1].setAnchor();
    points[0].setAnchor();
    points[(width*height)-width].setAnchor();

    let instancedPoints = new InstancePoint(points, 0.05, scene);
    let instancedSticks = new InstanceSticks(sticks, scene);
    completeMesh.push(instancedPoints);
    completeMesh.push(sticks);
    completeMesh.push(instancedSticks);
    completeMesh.push(vertices);

    return completeMesh;
}