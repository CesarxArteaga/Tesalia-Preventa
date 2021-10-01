<template>
        <ion-icon class="ion-margin-top" name="checkmark-circle-outline" style="font-size:7em" color="success"></ion-icon>
        <h4>
            Se ha registrado la información para PREVENTA correctamente.
        </h4>
        <ion-button class="ion-margin-top" @click="finish">
            Aceptar
        </ion-button>
</template>

<script>
import { IonButton , IonIcon } from '@ionic/vue';

import { addIcons } from 'ionicons';
import { sync , checkmarkCircleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default  {
  name: 'Complete',
  components: { IonButton , IonIcon },
  methods:{
    finish(){
      console.log('go back')
      this.$store.dispatch('SET_CLIENT_ACTION',{});
      this.$store.dispatch('SET_POLL_ACTION',{});
      this.$router.go(-1);
    }
  },
  created() {
      addIcons({
        'sync': sync,
        'checkmark-circle-outline': checkmarkCircleOutline
      })
    },
    setup() {
    const router = useRouter();
    return { router };
  }
}
</script>
<style scoped>
    .border{
        border: 1px solid #FFF;
        border-radius: .25rem;
    }
</style>