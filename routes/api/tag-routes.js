const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/',async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id',async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const idData = await Tag.findByPk(req.params.id, {
      // JOIN with travellers, using the Trip through table
      include: [{ model: Product }]
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

router.post('/',async (req, res) => {
  // create a new tag
  try {
    const createData = await Tag.create(req.body);
    res.status(200).json(createData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {
      // All the fields you can update and the data attached to the request body.
      tag_name: req.body.tag_name,
      
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
  // delete on tag by its `id` value
  try {
    const delData = await Tag.destroy({
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