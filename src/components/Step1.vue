<template>
        <h3>Suba una foto inicial para continuar</h3>

        <ion-segment v-if="!imgSelected" class="ion-no-border">
            <div class="fileUpload">
                <ion-button fill="clear" size="small" color="medium">
                    <ion-icon name="image" style="font-size:20px;padding-right:5px"></ion-icon>
                    <ion-label>Seleccionar Imagen</ion-label>
                </ion-button>
                <input accept="image/*" @change="uploadImageBefore( $event )" type="file" class="upload" />
            </div>
        </ion-segment>

        <div v-else style="position:relative">
            <span @click="removeImage" style="position:absolute;right:-10px;top:-10px;background:#fff;border-radius:2rem;padding:0px 2px;box-shadow:1px 1px 5px #808080"><ion-icon name="close" size="large"></ion-icon></span>
            <img :src="imgUrl" alt="">
        </div>

        <ion-button @click="nextStep">Continuar</ion-button>
</template>

<script>

import {  IonLabel,/* IonInput, IonItem ,*/ IonButton , IonSegment  , IonIcon , toastController } from '@ionic/vue';
import { addIcons } from "ionicons";
import { image , close } from "ionicons/icons";

export default  {
  name: 'Step1',
  components: { IonLabel,/* IonInput, IonItem ,*/ IonButton , IonSegment   , IonIcon},
  props: [

  ],
  data () {
      return {
            imgUrl: '', 
            imgFile: null,
            imgSelected: false
        }
  },
  methods:{
      async handleImageUpload(event) {
            this.imageFile = event.target.files[0];
            // console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
            // console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

            const options = {
                maxSizeMB: 30,
                maxWidthOrHeight: 1024,
                initialQuality : 0.8,
                useWebWorker: true
            }
            // console.log( 'file event' , imageFile )
            this.imgUrl = URL.createObjectURL( this.imageFile )
            //this.$store.dispatch('SET_IMAGE_BEFORE_ACTION' , imageFile )
            this.imgSelected = true
        },
        uploadImageBefore( event ) {
            if ( event ) {
                this.handleImageUpload( event )
                // this.imgUrl = previewFile
                // this.imgUrl = URL.createObjectURL( event )
            } else {
                this.imgFile = null
            }
        }
        ,
        removeImage(){
            this.imageFile = null
            this.imgUrl = ''
            this.imgSelected = false
        },
        nextStep(){
            if(this.imgSelected){
                this.$store.dispatch('SET_IMAGE_BEFORE_ACTION' , this.imageFile )
                this.$emit('nextStep' )
            }else{
                this.showToast();
            }
        },
        async showToast () {
            const toast = await toastController.create({
                color: 'warning',
                duration: 2000,
                message: 'Selecciona una imagen',
                showCloseButton: true
            });

            await toast.present();
        }
  }
  ,created () {
      addIcons({
          'image' : image,
          'close': close
      })
  }
}
</script>

<style scoped>
    .fileUpload {
        position: relative;
        overflow: hidden;
        margin: 10px;
        padding: 10px;
        background-color: #e2e2e2;
        color: #666666;
        border-radius: .5rem;
    }
    .fileUpload input.upload {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        filter: alpha(opacity=0);
    }
</style>