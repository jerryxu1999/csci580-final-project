import * as THREE from 'three';

export default class InitSticks
{
    constructor(sticks, scene)
    {
        this.sticks = sticks;
        console.log(this.sticks.length);
        this.geometry = new THREE.BufferGeometry();
        let initialPos = sticks.reduce((positions, stick) => positions.concat(stick.p1.position.toArray(), stick.p2.position.toArray()), []);
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialPos, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0x4b91c5, transparent: true});
        this.bundle  = new THREE.LineSegments(this.geometry, this.material);

        scene.add(this.bundle);
        
    }

    updateSticks(meshBool)
    {
        let updatedPos = []; 
        this.sticks.forEach(stick =>
            {
                if(meshBool){
                    this.material.opacity = 1;
                }
                else{
                    this.material.opacity = 0;
                }

                stick.update();
                //stick.updatePos();
                updatedPos.push(stick.p1.position.toArray(), stick.p2.position.toArray());
               
            } 
        );
        
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(updatedPos.flat(), 3));
    }

}