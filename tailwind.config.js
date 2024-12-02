/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'logo' : "url('/public/logo.png')",
      },
      fontFamily: {
        'awsome' : 'awsome'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mygblue : '#508EB1' ,
        myblue : '#505DB1' ,
        mypurple : '#7350B1' ,
        navblue : "#E8ECFF" ,
        text_b : "#6D6D6D" ,
        text_w : "#ECECEC" ,
      },
    },
    variants: {
      extend: {
        scrollbar : ['rounded'],
      }
    }
  },
  plugins: [
      require('tailwind-scrollbar')
  ],
};
