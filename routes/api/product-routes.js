const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const proData = await Product.findAll(req.body);
    res.status(200).json(proData);
  } catch (err) {
    res.status(400).json(err)
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const idData = await Product.findByPk(req.params.id, {
      // JOIN with travellers, using the Trip through table
      include: [{ model: Category }]
    });

    if (!idData) {
      res.status(404).json({ message: 'No location found with this id!' });
      return;
    }

    res.status(200).json(idData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            // product_name: product.product_name,
            // price: product.price,
            // stock: product.stock,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(
    {
      // All the fields you can update and the data attached to the request body.
      Product_name: req.body.Product_name,
      
    },
    {
      // Gets a book based on the book_id given in the request parameters
      where: {
        id: req.params.id,
      },
    }
  )
    .then((id) => {
      res.json(id);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });

  
});

router.delete('/:id',async (req, res) => {
  // delete one product by its `id` value
  try {
    const delData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!delData) {
      res.status(404).json({ message: 'No del found with this id!' });
      return;
    }

    res.status(200).json(delData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;