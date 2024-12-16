/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        'awsome' : 'awsome' ,
        'awsome_b' : 'awsome_b' ,
        "sans"  : 'Iranian Sans' ,
        'sans_m' : 'Iranian Sans_medium' ,
        'sans_b' : 'Iranian Sans_bold'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mygblue : '#508EB1',
        navblueD : '#33395D',
        myblue : '#505DB1' ,
        mypurple : '#7350B1' ,
        navblue : "#E8ECFF" ,
        text_b : "#6D6D6D" ,
        text_w : "#ECECEC" ,
        bgdark : '#171C38' ,
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
