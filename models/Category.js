const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: "",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    parentSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    depth: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for depth",
      },
    },
    // Adding direct references to all parent levels for easier querying
    level1Parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    level2Parent: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    level3Parent: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    // No need for level4Parent as that would be the current document
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for child subcategories
SubCategorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "parentSubCategory",
});

// Pre-save hook to set the parent references based on depth
SubCategorySchema.pre("save", async function (next) {
  if (this.isNew) {
    if (this.depth === 1) {
      this.level1Parent = this.parentCategory;
    } else if (this.depth === 2) {
      const parent = await mongoose
        .model("SubCategory")
        .findById(this.parentSubCategory);
      this.level1Parent = parent.level1Parent;
      this.level2Parent = this.parentSubCategory;
    } else if (this.depth === 3) {
      const parent = await mongoose
        .model("SubCategory")
        .findById(this.parentSubCategory);
      this.level1Parent = parent.level1Parent;
      this.level2Parent = parent.level2Parent || parent._id;
      this.level3Parent = this.parentSubCategory;
    } else if (this.depth === 4) {
      const parent = await mongoose
        .model("SubCategory")
        .findById(this.parentSubCategory);
      this.level1Parent = parent.level1Parent;
      this.level2Parent = parent.level2Parent;
      this.level3Parent = parent.level3Parent || parent._id;
    }
  }
  next();
});

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for top-level subcategories (depth = 1)
CategorySchema.virtual("subCategories", {
  ref: "SubCategory",
  localField: "_id",
  foreignField: "parentCategory",
});

CategorySchema.statics.initializeDefaults = async function () {
//   await this.deleteMany({});
//   await mongoose.model("SubCategory").deleteMany({});
//   console.log("Cleared all existing categories and subcategories");

  const defaultCategories = [
    {
      name: "LIVING ROOM",
      slug: "living-room",
      image: "/img/home/sofa.png",
      subCategories: [
        {
          name: "Sofa",
          slug: "sofa",
          image: "/img/home/sofa.png",
          subCategories: [
            {
              name: "Sectional Sofa",
              slug: "sectional-sofa",
              subCategories: [
                { name: "L-Shaped", slug: "l-shaped" },
                { name: "U-Shaped", slug: "u-shaped" },
                { name: "Modular", slug: "modular" },
              ],
            },
            {
              name: "Recliner Sofa",
              slug: "recliner-sofa",
              subCategories: [
                { name: "Single Recliner", slug: "single-recliner" },
                { name: "Double Recliner", slug: "double-recliner" },
                { name: "Power Recliner", slug: "power-recliner" },
              ],
            },
            {
              name: "Sleeper Sofa",
              slug: "sleeper-sofa",
              subCategories: [
                { name: "Futon", slug: "futon" },
                { name: "Pull-Out Bed", slug: "pull-out-bed" },
              ],
            },
          ],
        },
        {
          name: "Armchair",
          slug: "armchair",
          image: "/img/home/armchair.png",
          subCategories: [
            {
              name: "Lounge Chair",
              slug: "lounge-chair",
              subCategories: [
                { name: "Modern Lounge Chair", slug: "modern-lounge-chair" },
                { name: "Classic Lounge Chair", slug: "classic-lounge-chair" },
              ],
            },
            {
              name: "Rocking Chair",
              slug: "rocking-chair",
              subCategories: [
                { name: "Wooden Rocking Chair", slug: "wooden-rocking-chair" },
                {
                  name: "Upholstered Rocking Chair",
                  slug: "upholstered-rocking-chair",
                },
              ],
            },
          ],
        },
        {
          name: "Coffee Table",
          slug: "coffee-table",
          image: "/img/home/coffee_table.png",
          subCategories: [
            { name: "Glass Top", slug: "glass-top" },
            { name: "Wooden", slug: "wooden" },
          ],
        },
        { name: "Shelf", slug: "shelf", image: "/img/home/shelf.png" },
        { name: "Ottoman", slug: "ottoman", image: "/img/home/ottoman.png" },
        { name: "Cushion", slug: "cushion", image: "/img/home/cushion.png" },
        {
          name: "Side Table",
          slug: "side-table",
          image: "/img/home/table-lamp.png",
        },
      ],
    },
    {
      name: "KITCHEN",
      slug: "kitchen",
      image: "img/home/coffee_table.png",
      subCategories: [
        {
          name: "Blender",
          slug: "blender",
          subCategories: [
            {
              name: "Hand Blender",
              slug: "hand-blender",
              subCategories: [
                {
                  name: "Cordless Hand Blender",
                  slug: "cordless-hand-blender",
                },
                {
                  name: "Rechargeable Hand Blender",
                  slug: "rechargeable-hand-blender",
                },
              ],
            },
            {
              name: "Electric Blender",
              slug: "electric-blender",
              subCategories: [
                { name: "High-Speed Blender", slug: "high-speed-blender" },
                { name: "Personal Blender", slug: "personal-blender" },
              ],
            },
          ],
        },
        {
          name: "Dining Room",
          slug: "dining-room",
          subCategories: [
            { name: "Dining Table", slug: "dining-table" },
            { name: "Dining Chairs", slug: "dining-chairs" },
          ],
        },
      ],
    },
    {
      name: "BEDROOM",
      slug: "bedroom",
      image: "/img/home/bed.png",
      subCategories: [
        {
          name: "Bed",
          slug: "bed",
          image: "/img/home/bed.png",
          subCategories: [
            { name: "King Size", slug: "king-size" },
            { name: "Queen Size", slug: "queen-size" },
            { name: "Single Bed", slug: "single-bed" },
          ],
        },
        { name: "Wardrobe", slug: "wardrobe", image: "/img/home/wardrobe.png" },
        {
          name: "Dressing Table",
          slug: "dressing-table",
          image: "/img/home/dressing.png",
        },
        {
          name: "Window Curtain",
          slug: "window-curtain",
          image: "/img/home/windown.png",
        },
        {
          name: "Kids Beds",
          slug: "kids-beds",
          subCategories: [
            { name: "Bed Girl", slug: "bed-girl" },
            { name: "Bed Boy", slug: "bed-boy" },
          ],
        },
      ],
    },
    {
      name: "BATHROOM",
      slug: "bathroom",
      image: "/img/home/dressing.png",
      subCategories: [
        {
          name: "Bathroom Essentials",
          slug: "bathroom-essentials",
          subCategories: [
            {
              name: "Towels",
              slug: "towels",
              subCategories: [
                { name: "Hand Towels", slug: "hand-towels" },
                { name: "Bath Towels", slug: "bath-towels" },
                { name: "Face Towels", slug: "face-towels" },
              ],
            },
            {
              name: "Bath Mats",
              slug: "bath-mats",
              subCategories: [
                { name: "Non-Slip Mats", slug: "non-slip-mats" },
                { name: "Memory Foam Mats", slug: "memory-foam-mats" },
                { name: "Cotton Bath Mats", slug: "cotton-bath-mats" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "OUTDOOR",
      slug: "outdoor",
      image: "/img/home/armchair.png",
      subCategories: [
        {
          name: "Fireplace",
          slug: "fireplace",
          image: "/img/home/fireplace.png",
          subCategories: [
            { name: "Wood Fireplace", slug: "wood-fireplace" },
            { name: "Electric Fireplace", slug: "electric-fireplace" },
          ],
        },
      ],
    },
    {
      name: "LIGHTING",
      slug: "lighting",
      image: "/img/home/chandelier.png",
      subCategories: [
        {
          name: "Chandelier",
          slug: "chandelier",
          image: "/img/home/chandelier.png",
          subCategories: [
            {
              name: "Modern Chandelier",
              slug: "modern-chandelier",
              subCategories: [
                { name: "LED Chandeliers", slug: "led-chandeliers" },
                {
                  name: "Minimalist Chandeliers",
                  slug: "minimalist-chandeliers",
                },
                {
                  name: "Geometric Chandeliers",
                  slug: "geometric-chandeliers",
                },
              ],
            },
            {
              name: "Crystal Chandelier",
              slug: "crystal-chandelier",
              subCategories: [
                {
                  name: "Luxury Crystal Chandeliers",
                  slug: "luxury-crystal-chandeliers",
                },
                {
                  name: "Vintage Crystal Chandeliers",
                  slug: "vintage-crystal-chandeliers",
                },
                {
                  name: "Mini Crystal Chandeliers",
                  slug: "mini-crystal-chandeliers",
                },
              ],
            },
          ],
        },
        {
          name: "Ceiling Fan",
          slug: "ceiling-fan",
          image: "/img/home/ceiling_fan.png",
        },
        {
          name: "Floor Lamp",
          slug: "floor-lamp",
          image: "/img/home/floor_lamp.png",
        },
        {
          name: "Table Lamp",
          slug: "table-lamp",
          image: "/img/home/table-lamp.png",
        },
      ],
    },
    {
      name: "DECOR",
      slug: "decor",
      image: "/img/home/vase-flower.png",
      subCategories: [
        {
          name: "Vase & Flowers",
          slug: "vase-flower",
          image: "/img/home/vase-flower.png",
          subCategories: [
            {
              name: "Glass Vase",
              slug: "glass-vase",
              subCategories: [
                { name: "Clear Glass Vase", slug: "clear-glass-vase" },
                { name: "Colored Glass Vase", slug: "colored-glass-vase" },
                {
                  name: "Handcrafted Glass Vase",
                  slug: "handcrafted-glass-vase",
                },
              ],
            },
            {
              name: "Ceramic Vase",
              slug: "ceramic-vase",
              subCategories: [
                {
                  name: "Traditional Ceramic Vase",
                  slug: "traditional-ceramic-vase",
                },
                { name: "Modern Ceramic Vase", slug: "modern-ceramic-vase" },
                {
                  name: "Textured Ceramic Vase",
                  slug: "textured-ceramic-vase",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const createdCategories = [];

  for (const categoryData of defaultCategories) {
    const existingCategory = await this.findOne({ slug: categoryData.slug });

    if (!existingCategory) {
      // Create main category
      console.log("Initializing default categories...");
      const category = await this.create({
        name: categoryData.name,
        slug: categoryData.slug,
        image: categoryData.image,
        isFeatured: categoryData.isFeatured || false,
        isHidden: categoryData.isHidden || false,
      });

      // Create subcategories recursively
      if (categoryData.subCategories && categoryData.subCategories.length > 0) {
        await createSubCategories(categoryData.subCategories, category._id);
      }

      createdCategories.push(category.slug);
    }
  }

  if (createdCategories.length > 0) {
    console.log(
      `Successfully initialized ${createdCategories.length} categories`
    );
  }

  return createdCategories;
};

async function createSubCategories(subCategoriesData, parentId, depth = 1) {
  const SubCategory = mongoose.model("SubCategory");
  const createdSubs = [];

  for (const subCatData of subCategoriesData) {
    const existingSub = await SubCategory.findOne({ slug: subCatData.slug });

    if (!existingSub) {
      const subCategory = await SubCategory.create({
        name: subCatData.name,
        slug: subCatData.slug,
        image: subCatData.image,
        parentCategory: depth === 1 ? parentId : null,
        parentSubCategory: depth > 1 ? parentId : null,
        depth: depth,
        isFeatured: subCatData.isFeatured || false,
        isHidden: subCatData.isHidden || false,
      });

      if (subCatData.subCategories && subCatData.subCategories.length > 0) {
        if (depth < 4) {
          // Only create subcategories if we haven't reached max depth
          await createSubCategories(
            subCatData.subCategories,
            subCategory._id,
            depth + 1
          );
        } else {
          console.warn(
            `Maximum depth reached for ${subCategory.slug}. Cannot create further subcategories.`
          );
        }
      }

      createdSubs.push(subCategory.slug);
    }
  }

  return createdSubs;
}

const Category = mongoose.model("Category", CategorySchema);
const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

module.exports = { Category, SubCategory };
