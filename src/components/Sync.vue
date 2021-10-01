<template>
        <h6>Ingrese una ruta para obtener los respectivos clientes</h6>
        <p v-if="isSet">
            <ion-icon style="font-size:3em" color="success" name="checkmark-circle-outline"></ion-icon>
            <br>
            <span>Clientes Sincronizados Correctamente</span>
        </p>
        <p class="ion-padding">
            <ion-input v-model="ruta" placeholder="Ingrese Ruta" style="border:1px solid #FFF;border-radius:.25rem"></ion-input>
        </p>
        <p v-if="isFetching">
            <ion-spinner></ion-spinner>
        </p>
        <ion-button color="success" class="ion-margin-bottom" @click="getClients">Sincronizar</ion-button>
</template>

<script>
import { IonButton , IonIcon , IonSpinner , IonInput , toastController } from '@ionic/vue'
import { addIcons } from 'ionicons';
import { sync , checkmarkCircleOutline } from 'ionicons/icons';
import axios from 'axios';
import { Network } from '@capacitor/network';
export default {
    name: 'Sync',
    components: { IonIcon , IonButton , IonSpinner , IonInput },
    data(){
        return {
            ruta: '',
            isFetching: false,
            isSet: false
        }
    },
    methods:{
        getClients(){
            this.isFetching = true;
            axios.get(`https://preventa.plantroya.com/api/v1/seller/poll/getclients?ruta=${this.ruta}`)
            .then(response => {
                if(response.data.status){
                    setTimeout(() => {
                        this.isFetching = false;
                        localStorage.setItem('clientes-preventa',JSON.stringify(response.data.rows))
                        this.isSet=true
                        this.ruta = ''
                    }, 500);
                    setTimeout(() => {
                        this.isSet = false
                        this.$emit('closeForm');
                    }, 2500 );
                }else{
                    this.openToast(response.data.message,'danger');
                    this.isFetching = false
                }
            })
            .catch(err=>{
                this.isFetching = false
                this.openToast(err,'danger')
                console.log(err)
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
        
        }
    },
    created(){
        addIcons({
        'sync': sync,
        'checkmark-circle-outline': checkmarkCircleOutline
      })
    }
}
</script>

<style>

</style>