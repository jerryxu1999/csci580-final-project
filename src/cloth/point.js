import * as THREE from 'three';


const gravity = -9.8;
export default class Point 
{

    constructor(x,y,z, mass, anchor, damping)
    {
        this.position = new THREE.Vector3(x,y,z);
        this.PrevPosition = new THREE.Vector3(x,y,z);
        this.mass = mass;
        this.anchor = anchor;
        this.force = new THREE.Vector3(0,0,0);
        this.damping = damping;

        if(!this.anchor)
        {
            this.color = 0xFFFFFF;
        }
        else
        {
            this.color = 0x4b91c5
        }
        

    }

    setPrevPos(X,Y,Z)
    {
        this.PrevPosition = new THREE.Vector3(X,Y,Z);
    }

    setAnchor()
    {
        this.anchor = true;
        this.color = 0x4b91c5
    }

    removeAnchor()
    {
        this.anchor = false;

        this.color = 0xffffff;
    }

    applyForce(force)
    {
        this.force.add(force.clone());
    }

    update(dt, particleMass, wind, windAngle)
    {
            let Vel = new THREE.Vector3((this.position.x - this.PrevPosition.x), (this.position.y - this.PrevPosition.y), (this.position.z - this.PrevPosition.z));
            Vel.multiplyScalar(this.damping);
            this.PrevPosition = this.position.clone();

            let rad = windAngle*Math.PI*(1/180);
            let windVelo = 0.12*0.5*1.2*wind*wind;

            let temp = new THREE.Vector3(windVelo*Math.sin(rad), gravity*particleMass, windVelo*Math.cos(rad));
            let Acc = temp.clone().add(this.force.negate());
            this.mass = particleMass;

            //let temp = new THREE.Vector3(0, gravity*particleMass, 0);
            //let Acc = temp.clone().add(this.force.negate());
            //this.mass = particleMass;
            // removing this fixes the problem of where lower # mass makes it heavier 
            // and higher # mass makes it stiffer
            //Acc.divideScalar(this.mass);

            if(!this.anchor)
            {
                this.position.x += Vel.x + Acc.x * (dt*dt);
                this.position.y += Vel.y + Acc.y * (dt*dt);
                this.position.z += Vel.z + Acc.z * (dt*dt);
                this.force.sub(this.force);
            }
            
    }
    
    updatePos(dt)
    {
        if(!this.anchor)
        {
            let Vel = new THREE.Vector3((this.position.x - this.PrevPosition.x), (this.position.y - this.PrevPosition.y), (this.position.z - this.PrevPosition.z));

            this.PrevPosition = this.position.clone();

            let Acc = new THREE.Vector3(0, gravity / this.mass, 0);

            this.position.x += Vel.x + Acc.x * (dt*dt);
            this.position.y += Vel.y + Acc.y * (dt*dt);
            this.position.z += Vel.z + Acc.z * (dt*dt);

        }
    }
}