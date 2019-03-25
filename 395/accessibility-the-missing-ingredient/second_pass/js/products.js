var source    = document.getElementById("all_products").innerHTML,
    template  = Handlebars.compile(source),
    container = document.getElementById("main"),
    data         = { products: [
    {
      title: "Jetpack",
      price: "500.00",
      img_uri:  "http://goo.gl/riaO3q",
      description: "It's only a jetpack--a simple, high-thrust, fuel-thirsty jetpack. I would add this puppy to the cart. What could go wrong?",
      pid: "product_093A14"
    },
    {
      title: "Gyro Housing Kit",
      price: "211.49",
      img_uri:  "http://goo.gl/sUTvRC",
      description: "This kit comes with wires, capacitors, nuts, bolts and spiffy decals.",
      pid: "product_033A14"
    },
    {
      title: "Robotic Cat",
      price: "10.99",
      img_uri:  "http://goo.gl/xbhtxt",
      description: "Some of you will see a poorly drawn, robotic cat; others will see the cat of the future. Regardless, this thing is made out of space-age, feline polymers.",
      pid: "product_023A14"
    },
    {
      title: "Shielding Kit",
      price: "1040.90",
      img_uri:  "http://goo.gl/IxsKtP",
      description: "In a dystopian future, a robot warrior is only as strong as its armor. You need this armor.",
      pid: "product_043A14"
    }
  ]};
container.innerHTML = template(data);
