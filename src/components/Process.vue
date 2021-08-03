<template>
        <div class="ion-padding" style="background-color:#000;font-size:1.2em;position:fixed;z-index:1000;width:100%">
          <span>Tiempo Transcurrido</span> 
          <span class="border" style="padding:6px;margin-left:15px;margin-right:15px">
            {{minutes}} : <span v-if="seconds.toString().length == 1">0</span>{{seconds}}
          </span>
        </div>

        <div class="ion-padding">
          <h5 style="margin-top:3rem">Fotos Iniciales y Finales de la Actividad</h5>
          <ion-grid>
            <ion-row>
              <ion-col>
                <div class="border">
                  <div v-if="photoFirstUrl==''">
                    <input type="file" id="file1" @change="savePhotoFirst($event)" hidden/>
                    <label for="file1"> <ion-icon name="image-outline"></ion-icon> Subir Foto Inicial</label>
                  </div>
                  <div v-else>
                    <ion-icon name="close-circle" size="large" style="position:absolute;top:-3px;right:-3px" @click="removePhoto(1)"></ion-icon>
                    <img :src="photoFirstUrl">
                  </div>
                </div>
              </ion-col>
              <ion-col>
                <div class="border">
                  <div v-if="photoLastUrl==''">
                    <input type="file" id="file2" @change="savePhotoLast($event)" hidden/>
                    <label for="file2"> <ion-icon name="image-outline"></ion-icon> Subir Foto Final</label>
                  </div>
                  <div v-else>
                    <ion-icon name="close-circle" size="large" style="position:absolute;top:-3px;right:-3px" @click.stop="removePhoto(2)"></ion-icon>
                    <img :src="photoLastUrl">
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        
        <div>
          <h5>Completar Encuesta</h5>
          <ion-grid>
            <ion-row>
              <ion-col>PRODUCTOS</ion-col>
              <ion-col>UNIDADES</ion-col>
            </ion-row>
            <p class="ion-margin" style="border-top:1px solid #FFF"></p>
            <div v-for="(product,indexP) in products" :key="indexP" class="ion-margin">
              <div class="col">
                <ion-label>{{product.name}}</ion-label>
                <ion-input class="border" style="font-size:1.6em" v-model.lazy="product.value"></ion-input>
              </div>
            </div>
          </ion-grid>

        </div>

        <div style="clear:both">
          <h5 class="ion-padding-top">Agregar Incidencias de la Ruta</h5>
          <ion-list style="background:unset">
            <div v-for="(incidencia,index) in incidencias" :key="index">
              <ion-item color="dark" >
                <ion-label>{{incidencia.text}}</ion-label>
                <ion-checkbox
                  slot="start"
                  @update:modelValue="incidencia.isChecked = $event"
                  :modelValue="incidencia.isChecked">
                </ion-checkbox>
              </ion-item>
              <div style="padding: 0px 15px 15px 15px" v-show="incidencia.isChecked">
                <ion-textarea class="ion-text-left border"  placeholder="Agregar comentario..." v-model="incidencia.comment"></ion-textarea>
              </div>
            </div>
          </ion-list>
        </div>

          <ion-button fill="outline" color="light" @click="goBack">Atras</ion-button>
          <ion-button style="margin-left:2rem" @click="presentAlertConfirm">Continuar</ion-button>
</template>

<script>
/* eslint-disable */
import { IonGrid , IonRow , IonCol , IonLabel , IonInput , IonTextarea , IonCheckbox , IonList , IonItem , toastController , IonButton , IonIcon , alertController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { addIcons } from 'ionicons';
import { imageOutline , checkmarkOutline , closeCircle } from 'ionicons/icons';
import axios from 'axios';
import { Geolocation } from '@ionic-native/geolocation'

import { ref, onMounted, watch } from 'vue';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Network } from '@capacitor/network';

export default  {
  name: 'Process',
  components: { IonGrid , IonRow , IonCol , IonLabel , IonInput , IonTextarea , IonCheckbox , IonList , IonItem , IonButton , IonIcon }
  ,data () {
      return {
            count: true,
            minutes: 0,
            seconds: 0,
            client: this.$store.getters.GET_CLIENT,
            products: [],
            incidencias: [],
            photoFirstUrl: '',
            photoFirstFile: null,
            photoLastUrl: '',
            photoLastFile: null,
            lat: 0,
            lng: 0,
            duration: 0
        }
  },
  methods:{
    savePhotoFirst(event){
        this.photoFirstFile = event.target.files[0];
        this.photoFirstUrl = URL.createObjectURL(this.photoFirstFile);
      },
    savePhotoLast(event){
      this.photoLastFile = event.target.files[0];
      this.photoLastUrl = URL.createObjectURL(this.photoLastFile);
    },
    removePhoto(index){
      if(index == 1){
        this.photoFirstUrl = ''
        this.photoFirstFile = null
      }else if(index == 2){
        this.photoLastUrl = ''
        this.photoLastFile = null
      }
    },
    getPols(){
        this.products = JSON.parse(localStorage.getItem('polls-preventa'));
        this.products.forEach(prod => { //asignando un valor para el input
            prod.value = 0
        });
    },
    getIncidences(){
        const array_incds = JSON.parse(localStorage.getItem('incidences-preventa'));
        array_incds.forEach(incidencia => {
            this.incidencias.push({id: incidencia.id, text: incidencia.name, isChecked: false , comment: ''})
        });
    },
    getLocation(){
      Geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude 
        this.lng = resp.coords.longitude 
      }).catch((err) => {
        console.log(err)
      })
    },
    saveTime(){
      this.count = false
      let time_temp = 0;
      if(this.minutes >= 1){
        time_temp = this.minutes*60
      }
      time_temp = time_temp + this.seconds
      this.duration = time_temp
      console.log('Tiempo Finalizado');
    },
    orderPolls(){
      this.products = this.products.sort(function (a,b) {
        if(a.group_id > b.group_id){
          return a;
        }
      })
    },
    async completeProcess(){
        this.saveTime();

        //Parametros a servidor para insertar poll
        let form = new FormData;

        form.append('client_id', this.client.id )
        form.append('lat', this.lat )
        form.append('lng', this.lng )
        form.append('file_before', this.photoFirstFile) //Enviando foto comprimida
        form.append('file_after', this.photoLastFile ) //Enviando foto comprimida
        form.append('duration', this.duration )

        /* Enviando las respuestas */
        let rows = [];
        this.products.forEach(product => {
          rows.push({
            id: product.id,
            name: product.name,
            value: product.value
          })
        });
        /* Agregando Respuestas a form*/
        form.append('rows', JSON.stringify(rows) )

        /* Validando incidencias */
        let incidences = [] // Incidencias que se envian a api
        this.incidencias.forEach(incidencia => {
          if(incidencia.isChecked){
            incidences.push({
              id: incidencia.id,
              comment: incidencia.comment
            })
          }
        });
        /* Agregando incidencias al form */
        form.append('incidences', JSON.stringify(incidences));

        let recienteItem = {'client_id': this.client.id, 'client_code': this.client.code, 'lat': this.lat, 'lng': this.lng , 'rows': JSON.stringify(rows), 'incidences': JSON.stringify(incidences)}

        /* Si el telefono esta conectado a internte sube data a servidor */
        const  network = await Network.getStatus()
        
        let recientes = [];
        if(localStorage.getItem('recientes-entrega')){
            recientes = JSON.parse(localStorage.getItem('recientes-entrega'))
        }

        if(network.connected){
          recienteItem.uploaded = true

          console.log('CON INTERNET')
                            recientes.push(recienteItem);

                            localStorage.setItem('recientes-preventa', JSON.stringify(recientes));
                            this.$emit('nextStep');

          axios.post( 'https://preventa-dev.plantroya.com/api/v1/seller/poll' , form )
          //axios.post( 'http://tesalia.presale.wa.test/api/v1/seller/poll' , form )
                .then( response => {
                  console.log(response.data)
                    if ( response.data.status ) {
                        setTimeout( () => {
                            recientes.push(recienteItem);
                            localStorage.setItem('recientes-preventa', JSON.stringify(recientes));
                            this.$emit('nextStep');
                        },500)
                    } else {
                      this.openToast(response.data.message , 'danger');
                      return false
                    }
                })
                .catch( failure  => {
                    console.log( failure )
                    return false
                })
        }else{
            recienteItem.uploaded = false;

            console.log('SIN INTERNET')

            //Conviertiendo a base64
            const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });

            const savePicture = async (photo, fileName) => {
                let base64Data;

                // Fetch the photo, read as a blob, then convert to base64 format
                const blob = photo;
                base64Data = await convertBlobToBase64(blob);

                const savedFile = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Data
                });

                // Use webPath to display the new image instead of base64 since it's
                // already loaded into memory
                return {
                    filepath: fileName,
                    webviewPath: photo.webPath
                };
            }

            /* Guardando Foto Antes */
            const fileNameBefore = new Date().getTime() + recienteItem.client_code + 'before.jpeg';
            const savedFileImageBefore = await savePicture(this.photoFirstFile, fileNameBefore);

            /* Guardando Foto Despues */
            const fileNameAfter = new Date().getTime() + recienteItem.client_code + 'after.jpeg';
            const savedFileImageAfter = await savePicture(this.photoLastFile, fileNameAfter);

            /* Añadiendo Identificadores de photos a Item Reciente */
            recienteItem.filepath_before = savedFileImageBefore.filepath;
            recienteItem.filepath_after = savedFileImageAfter.filepath;

            /* Añadiendo item a localStorage */
            recientes.push(recienteItem);
            localStorage.setItem('recientes-preventa', JSON.stringify(recientes));
            this.$emit('nextStep');
        }

        

    },
    async presentAlertConfirm(){
      if(this.validatePhotos() && this.validateAnswers() ){ //Si los campos han sido llenados correctamente
        const alert = await alertController
          .create({
            cssClass: 'my-custom-class',
            header: 'Finalizar Encuesta',
            message: '¿Esta seguro que desea finalizar la encuesta con los campos ingresados?',
            backdropDismiss: true,
            translucent: true,
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel:')
                },
              },
              {
                text: 'Aceptar',
                handler: () => {
                  console.log('Confirm Okay')
                    this.completeProcess();
                },
              },
            ],
          });
        return alert.present();
      }
    },
    async openToast(msg,type) {
      const toast = await toastController
        .create({
          message: msg,
          color: type,
          duration: 2000
        })
      return toast.present();
      
    },
    validatePhotos(){
      if(this.photoFirstUrl == '' || this.photoLastUrl == ''){ //Si las fotos no se han cargado
        this.openToast('Ingrese todas fotos requeridas','danger')
        return false;
      }else{
        return true;
      }
    },
    validateAnswers(){
      return true;
    },
    goBack(){
      this.$router.back();
      this.$store.dispatch('SET_CLIENT_ACTION',{});
      this.$store.dispatch('SET_POLL_ACTION',{});
      this.$emit('backStep');
    }
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  created() {
    addIcons({
      'image-outline': imageOutline,
      'checkmark-outline': checkmarkOutline,
      'close-circle': closeCircle
    })
    
  },
  mounted(){
    this.getPols()
    this.orderPolls()
    this.getLocation()    
    this.getIncidences()
  },
  watch: {
    seconds: {
      handler(){
        if(this.count){
          setTimeout(()=>{
            this.seconds++
            if(this.seconds == 60){
              this.seconds = 0
              this.minutes++
            }
          }, 1000 )
        }
      },
      immediate: true
    }
    }
}
</script>

<style scoped>
  .border{
    border: 1px solid #FFF;
    border-radius: .25rem;
  }
  .custom{
    width: 100px;
    margin-right: 10px;
  }
  label{
    display: inline-block;
    background-color: rgb(14, 14, 14);
    color: white;
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.2rem;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: .9em;
  }
  .col{
    float: left;
    font-size: .7em;
    max-width: 110px;
    margin: 5px;
  }
</style>