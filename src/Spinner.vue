<template>
  <div className="spinner">
    <div
      v-for="i in 12"
      :key="i"
      class="spinner-circle"
    />
  </div>
</template>

<style lang="css" scoped>
@keyframes spinner-circle-animation {
  0%, 39%, 100% {
    opacity: 0;
  }

  40% {
    opacity: 1;
  }
}

.spinner {
  position: relative;
  width: var(--vs-spinner-size);
  height: var(--vs-spinner-size);
  margin: 0;
  padding: 0;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.spinner-circle:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: var(--vs-spinner-color);
  border-radius: 100%;
  -webkit-animation: spinner-circle-animation 1.2s infinite ease-in-out both;
  animation: spinner-circle-animation 1.2s infinite ease-in-out both;
}

.spinner-circle:nth-child(2) {
  transform: rotate(30deg);
}

.spinner-circle:nth-child(3) {
  transform: rotate(60deg);
}

.spinner-circle:nth-child(4) {
  transform: rotate(90deg);
}

.spinner-circle:nth-child(5) {
  transform: rotate(120deg);
}

.spinner-circle:nth-child(6) {
  transform: rotate(150deg);
}

.spinner-circle:nth-child(7) {
  transform: rotate(180deg);
}

.spinner-circle:nth-child(8) {
  transform: rotate(210deg);
}

.spinner-circle:nth-child(9) {
  transform: rotate(240deg);
}

.spinner-circle:nth-child(10) {
  transform: rotate(270deg);
}

.spinner-circle:nth-child(11) {
  transform: rotate(300deg);
}

.spinner-circle:nth-child(12) {
  transform: rotate(330deg);
}

.spinner-circle:nth-child(2):before {
  animation-delay: -1.1s;
}

.spinner-circle:nth-child(3):before {
  animation-delay: -1s;
}

.spinner-circle:nth-child(4):before {
  animation-delay: -0.9s;
}

.spinner-circle:nth-child(5):before {
  animation-delay: -0.8s;
}

.spinner-circle:nth-child(6):before {
  animation-delay: -0.7s;
}

.spinner-circle:nth-child(7):before {
  animation-delay: -0.6s;
}

.spinner-circle:nth-child(8):before {
  animation-delay: -0.5s;
}

.spinner-circle:nth-child(9):before {
  animation-delay: -0.4s;
}

.spinner-circle:nth-child(10):before {
  animation-delay: -0.3s;
}

.spinner-circle:nth-child(11):before {
  animation-delay: -0.2s;
}

.spinner-circle:nth-child(12):before {
  animation-delay: -0.1s;
}
</style>
