/*
0000000001 Author RomLabo
1000111000 Class Data
1000000001 Created on 07/11/2022.
1000100011111000000001100001110000
1000110001111000110001100010101000
0000011000011000000001100011011000
*/
class Data {
    constructor() {
        this.cnv = document.getElementById("main-canvas");
        this.da = [];
    }
    save(md, im) {
        this.da.splice(0);let bi=[],nd=511,dn=510,tf=509,kp=508,eg=dn/2,hg=9;
        for(let i=0;i<md.length;i++){let sr="";this.da.push(md[i].type);this
        .da.push(Math.round((md[i].x/this.cnv.width)*100));this.da.push(Math
        .round((md[i].y/this.cnv.height)*100));for(let y=0;y<md[i].output.length;
        y++){this.da.push(kp);for(let j=0;j<md[i].output[y].length;j++){this.da
        .push(md[i].output[y][j]);}}for(let z=0;z<md[i].txt.length;z++){let bj=md[
        i].txt[z];let kz;if(md[i].type===208){kz=z===1?bj.join('\n'):bj.join(' ');    
        }else{kz=bj.join('\n');}kz=kz.padStart((kz.length+1),String.fromCodePoint(
        tf));sr+=kz;}for(let j=0;j<sr.length;j++){this.da.push(sr.codePointAt(j));
        }}let g=0,fi=dn/2,i=0;this.da.push(dn);this.da.push(nd);for(let i=0;i<this
        .da.length;i++){for(let z=0;z<hg;z++){bi.push(this.da[i]%2);this.da[i]=this
        .da[i]/2|0;}}while(i<bi.length&&g<im.data.length-4){if(im.data[g]===eg&&im
        .data[g+1]===fi&&im.data[g+2]===eg){im.data[g]=im.data[g]-bi[i];im.data[g+1
        ]=im.data[g+1]-bi[i+1];im.data[g+2]=im.data[g+2]-bi[i+2];i+=3}g+=4;}
        return im;
    }
    load(im) {
        let ic=false,fh=85*3,mo={x:0,y:0,allText:[[''],[''],['']],type:0,out:[]},ef=9;
        this.da.splice(0);let ra=fh,re=[],nm=[],pr=[],gk=fh-1,txt=[],ix=0,vl=0,iu=gk;
        let p=0;while(p<im.length&&vl!==fh*2+1){if((im[p]===ra||im[p]===gk)&&(im[p+1] 
        ===fh||im[p+1]===gk)&&(im[p+2]===ra||im[p+2]===iu)){vl+=(ra-im[p])*(Math.pow(2,
        ix));vl+=(fh-im[p+1])*(Math.pow(2,ix+1));vl+=(fh-im[p+2])*(Math.pow(2,ix+2));
        ix+=3;}if(ix%ef===0&&ix!==0){re.push(vl);ix=0;vl=vl===fh*2+1?iu*2+3:0;}p+=4;}
        for(let i=0;i<re.length-1;i++){if(re[i]>=203&&re[i]<=208){if(i!==0){mo={x:nm[1],
        y:nm[2],txt:txt,type:nm[0],output:pr};this.da.push(mo);nm=[];pr=[];txt=[];}nm
        .push(re[i]);ic=true;}else if(re[i]===fh*2-1){ic=false;txt.push('');}else if(
        re[i]===510){mo={x:nm[1],y:nm[2],txt:txt,type:nm[0],output:pr};this.da.push(mo);
        }else{if(ic&&nm.length===1){nm.push(Math.round(((re[i])/100)*this.cnv.width));
        }else if(ic&&nm.length===2){nm.push(Math.round(((re[i])/100)*this.cnv.height));
        }else if(ic&&nm.length>=3){re[i]===508?pr.push([]):pr[pr.length-1].push(re[i]);
        }else{txt[txt.length-1]+=re[i]==165?'':String.fromCodePoint(re[i]);}}}
        return this.da;
    }
}