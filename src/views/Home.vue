<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="ion-text-center">
            <ion-title> <img height="56" src="/assets/img/logo-header-main.png" /></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-text-center ion-padding">
      <ion-grid>
        <ion-row class="ion-padding ruta-item" >
            <ion-col> <ion-icon name="trophy" style="font-size:22px;margin-bottom:-5px;margin-right:5px"></ion-icon> META DIARIA</ion-col>
            <ion-col> {{metaActual}} / {{ metaFinal }}</ion-col>
        </ion-row>
      </ion-grid>
      <ion-button class="ion-margin-top" @click="goNext">Registrar Visita</ion-button>
      <br><br>
      <ion-button fill="outline" color="light" @click="()=>!openForm?openForm=true:openForm=false">Sincronizar Clientes</ion-button>

      <ion-grid>
        <ion-row>
          <ion-col>
            <div v-if="openForm" class="border">
              <sync @closeForm="closeForm"></sync>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      

      <p class="ion-margin" style="border-top:1px solid #FFF"></p>
      
      <!-- Mensaje Iconos -->
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-left border">
              <p style="margin:6px"><ion-icon style="font-size:1.4em;margin-bottom:-6px" name="checkmark-circle-outline" color="success"></ion-icon> <span style="font-size:.8em">La vísita fue registrada correctamente.</span></p>
              <p style="margin:6px"><ion-icon style="font-size:1.4em;margin-bottom:-6px" name="sync" color="warning"></ion-icon> <span style="font-size:.8em">La vísita debe sincronizarse.</span> </p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <h5>CLIENTES RECIENTES</h5>
      <ion-grid>
          <ion-row>
            <ion-col>Cliente</ion-col>
            <ion-col>Status</ion-col>
          </ion-row>
          <ion-row v-if="rutasRecientes.length == 0">
              <ion-col> <div class="ruta-item ion-padding"> No Tienes Rutas Recientes </div> </ion-col>
          </ion-row>
          <ion-row v-else v-for="(reciente , index ) in rutasRecientes" :key="index" class="ion-padding ruta-item" style="margin-bottom:5px">
              <ion-col> <div style="margin-top:5px"> {{reciente.client_code}} </div> </ion-col>
              <ion-col > 
                <ion-icon v-if="reciente.uploaded" name="checkmark-circle-outline" style="font-size:30px" color="success"></ion-icon>
                <ion-icon v-else name="sync" style="font-size:30px" color="warning" @click="sync( $event , index)" ></ion-icon>
              </ion-col>
          </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script>
/* eslint-disable */
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonGrid , IonRow , IonCol , IonButton , IonIcon , IonButtons , toastController } from '@ionic/vue';
import { addIcons } from 'ionicons';
import { sync , checkmarkCircleOutline , trophy , ellipsisVertical } from 'ionicons/icons';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Network } from '@capacitor/network';

import Sync from '../components/Sync.vue';

export default  {
  name: 'Home',
  components: { 'sync': Sync , IonHeader, IonToolbar, IonTitle, IonContent , IonGrid , IonRow , IonCol , IonPage , IonButton , IonIcon , IonButtons }
  ,data () {
      return {
            metaFinal: 3,
            metaActual: 0,
            rutasRecientes: [],
            openForm: false,
            today: ''
        }
  },
  methods:{
    goNext(){
      this.$router.push('/poll')
    },
    async sync( event , index ){

      const  network = await Network.getStatus()

      if(network.connected == false){
        return this.openToast('¡¡No tiene conexión a internet!!','warning');
      }

      let el = event.target
      el.classList.add('roting');

      console.log('subiendo')

      let form = new FormData
      form.append('client_id', this.rutasRecientes[index].client_id )
      form.append('lat', this.rutasRecientes[index].lat )
      form.append('lng', this.rutasRecientes[index].lng )

      /* Imagen ANTES */
      /* Leyendo imagen guardada en storage de telefono */
      const contentBefore = await Filesystem.readFile({
          path: this.rutasRecientes[index].filepath_before,
          directory: Directory.Data
        })
      /* Convertiendo imagenbase64 a file_before para subir */
      let fileBeforeBase64 =  `data:image/jpeg;base64,${contentBefore.data}`;
      let fileBefore = await this.dataURLtoFile(fileBeforeBase64, 'image1' );
      form.append('file_before', fileBefore );

      /* Imagen DESPUES */
      /* Leyendo imagen guardada en storage de telefono */
      const contentAfter = await Filesystem.readFile({
          path: this.rutasRecientes[index].filepath_after,
          directory: Directory.Data
        })
      /* Convertiendo imagenbase64 a file_before para subir */
      let fileAfterBase64 =  `data:image/jpeg;base64,${contentAfter.data}`;
      let fileAfter = await this.dataURLtoFile(fileAfterBase64, 'image2' );
      form.append('file_after', fileAfter );


      form.append('rows', this.rutasRecientes[index].rows ) //enviando respuestas
      form.append('incidences', this.rutasRecientes[index].incidences ) //enviando respuestas

      //xios.post( 'http://tesalia.presale.wa.test/api/v1/seller/poll' , form )
      axios.post( 'https://preventa.plantroya.com/api/v1/seller/poll' , form )
        .then( response => {
          console.log(response.data)
            if ( response.data.status ) {
                setTimeout( () => {
                    el.classList.remove('roting');
                    this.rutasRecientes[index].uploaded = true;
                    /* Actualizando LocalStorage */
                    localStorage.setItem('recientes-preventa',JSON.stringify(this.rutasRecientes))
                    this.openToast('Visita Guardada', 'success' );
                },600)
            } else {
              this.openToast(response.data.message , 'danger' );
              el.classList.remove('roting');
            }
        })
        .catch( failure  => {
            console.log( failure )
            this.openToast(failure,'danger');
        })
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
    async urltoFile(url, filename, mimeType){
        return (fetch(url)
            .then(function(res){return res.arrayBuffer();})
            .then(function(buf){return new File([buf], filename,{type:mimeType});})
        );
    },
    async dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type:mime});
    },
    getPols(){
      console.log('getting polls')
      if(!localStorage.getItem('polls-preventa')){
        axios.get('https://preventa.plantroya.com/api/v1/seller/poll/create' )
        .then( response => {
           localStorage.setItem('polls-preventa',JSON.stringify(response.data.rows));
        })
        .catch( failure => {
            console.log(failure)
        })
      }
    },
    getIncidences(){
      console.log('getting incidences')
      if(!localStorage.getItem('incidences-preventa')){
        axios.get('https://preventa.plantroya.com/api/v1/seller/poll/getincidences' )
          .then( response => {
              localStorage.setItem('incidences-preventa', JSON.stringify(response.data.rows))
          })
          .catch( failure => {
              console.log(failure)
          })
      }
    },
    closeForm(){
      this.openForm = false;
    }
  },
  created() {
      addIcons({
        'sync': sync,
        'checkmark-circle-outline': checkmarkCircleOutline,
        'trophy': trophy,
        'ellipsis-vertical': ellipsisVertical
      })
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted(){
    const d = new Date();
    this.today = d.toLocaleDateString('pt-PT');
    this.getPols()
    this.getIncidences()
    
  },
  updated(){
      let count = 0;
      if(localStorage.getItem('recientes-preventa')){
      this.rutasRecientes = JSON.parse(localStorage.getItem('recientes-preventa'))
      this.rutasRecientes.forEach(ruta => {
        /* count++;
        (ruta.uploaded && this.today == ruta.date ? this.metaActual = count : '' ) */
        if(ruta.uploaded && this.today == ruta.date ){
          count++;
          this.metaActual = count
        }
      })
    }
  }
}
</script>
<style scoped>
    .border{
      border: 1px solid rgb(74, 98, 114);
      background-color: rgb(59, 79, 92);
      border-radius: .25rem;

    }
    .ruta-item{
      background-color: #1b262e;
      border-radius: .25rem;
    }
    .roting{
      animation-name: rotate;
      animation-duration: 1.5s;
      animation-iteration-count: infinite;
    }
    @keyframes rotate {
      from { transform: rotate(0deg);}
      to { transform: rotate(180deg);}
    }
</style>