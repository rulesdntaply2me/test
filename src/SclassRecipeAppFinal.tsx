
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Save,
  Download,
  Trash2,
  Calculator,
  ChefHat,
  Sparkles,
  Layers3,
  IceCreamBowl,
  Users,
  BookOpen,
  Wand2,
} from "lucide-react";

type Goal = "Lean" | "Bulk" | "Anabolic" | "Low Cal" | "No Sugar";
type ProteinMode = "Whey" | "No Whey";
type Ingredient = [string, number];
type Macro = { cal: number; p: number; c: number; f: number };

type Recipe = {
  category: string;
  name: string;
  clientName: string;
  servings: number;
  base: Ingredient[];
  method: string[];
  flavors: Record<string, Ingredient[]>;
  flavorHow: Record<string, string[]>;
  swirls: Record<string, Ingredient[]>;
  swirlBuild: Record<string, string[]>;
  toppings: Record<string, Ingredient[]>;
  toppingHow: Record<string, string[]>;
  creami: string[];
};

type SavedBuild = {
  id: string;
  customName: string;
  recipeName: string;
  goal: Goal;
  flavor: string;
  swirl: string;
  topping: string;
};


const BRAND = {
  name: "Sclass Fitness",
  appName: "Sclass Recipe Vault",
  tag: "Luxury performance recipes",
  logos: {
    main: "/logo-main.svg",
    mark: "/logo-mark.svg",
    online: "/logo-online.svg",
  },
};

const db: Record<string, { unit: string; cal: number; p: number; c: number; f: number }> = {
  "whey isolate": { unit: "g", cal: 3.8, p: 0.84, c: 0.06, f: 0.03 },
  "oat flour": { unit: "g", cal: 4.04, p: 0.14, c: 0.68, f: 0.09 },
  "cocoa powder": { unit: "g", cal: 2.28, p: 0.2, c: 0.58, f: 0.14 },
  "egg whites": { unit: "g", cal: 0.52, p: 0.11, c: 0.007, f: 0.002 },
  "whole egg": { unit: "unit", cal: 70, p: 6, c: 0.4, f: 5 },
  "greek yogurt nonfat": { unit: "g", cal: 0.59, p: 0.1, c: 0.036, f: 0.004 },
  "light cream cheese": { unit: "g", cal: 2.1, p: 0.07, c: 0.05, f: 0.15 },
  "almond milk unsweetened": { unit: "ml", cal: 0.13, p: 0.005, c: 0.003, f: 0.011 },
  "baking powder": { unit: "g", cal: 0.53, p: 0, c: 0.28, f: 0 },
  "zero-cal sweetener": { unit: "g", cal: 0, p: 0, c: 0, f: 0 },
  "sugar-free syrup": { unit: "g", cal: 0.2, p: 0, c: 0.05, f: 0 },
  blueberries: { unit: "g", cal: 0.57, p: 0.007, c: 0.145, f: 0.003 },
  strawberries: { unit: "g", cal: 0.32, p: 0.007, c: 0.077, f: 0.003 },
  pb2: { unit: "g", cal: 4, p: 0.5, c: 0.33, f: 0.125 },
  "biscoff spread": { unit: "g", cal: 5.84, p: 0.03, c: 0.58, f: 0.37 },
  "dark chocolate chips": { unit: "g", cal: 5, p: 0.06, c: 0.63, f: 0.27 },
  "sugar-free chocolate chips": { unit: "g", cal: 4.3, p: 0.05, c: 0.5, f: 0.28 },
  "graham crumbs": { unit: "g", cal: 4.6, p: 0.07, c: 0.78, f: 0.13 },
  cinnamon: { unit: "g", cal: 2.47, p: 0.04, c: 0.81, f: 0.01 },
  "vanilla extract": { unit: "g", cal: 2.88, p: 0, c: 0.13, f: 0 },
  "pudding mix sugar-free cheesecake": { unit: "g", cal: 3.3, p: 0, c: 0.8, f: 0 },
  "instant pudding sugar-free vanilla": { unit: "g", cal: 3.4, p: 0, c: 0.82, f: 0 },
  "xanthan gum": { unit: "g", cal: 3.3, p: 0, c: 0.77, f: 0 },
  "rice krispies cereal": { unit: "g", cal: 3.88, p: 0.07, c: 0.88, f: 0.01 },
  "chocolate crispy rice cereal": { unit: "g", cal: 4.04, p: 0.06, c: 0.85, f: 0.09 },
  "mini marshmallows": { unit: "g", cal: 3.18, p: 0.02, c: 0.79, f: 0 },
  "light butter": { unit: "g", cal: 3.6, p: 0, c: 0, f: 0.4 },
  butter: { unit: "g", cal: 7.17, p: 0.01, c: 0.0, f: 0.81 },
  "irish butter": { unit: "g", cal: 7.2, p: 0.01, c: 0.0, f: 0.82 },
  banana: { unit: "g", cal: 0.89, p: 0.011, c: 0.228, f: 0.003 },
  apple: { unit: "g", cal: 0.52, p: 0.003, c: 0.14, f: 0.002 },
  pumpkin: { unit: "g", cal: 0.26, p: 0.01, c: 0.065, f: 0.001 },
  coconut: { unit: "g", cal: 6.6, p: 0.07, c: 0.24, f: 0.65 },
  pecans: { unit: "g", cal: 6.9, p: 0.09, c: 0.14, f: 0.72 },
  caramel: { unit: "g", cal: 3.6, p: 0.0, c: 0.75, f: 0.03 },
  lemon: { unit: "g", cal: 0.29, p: 0.011, c: 0.093, f: 0.003 },
  cherries: { unit: "g", cal: 0.63, p: 0.01, c: 0.16, f: 0.002 },
  peaches: { unit: "g", cal: 0.39, p: 0.009, c: 0.095, f: 0.003 },
  salt: { unit: "g", cal: 0, p: 0, c: 0, f: 0 },
};

const goalOptions: Goal[] = ["Lean", "Bulk", "Anabolic", "Low Cal", "No Sugar"];

const flavorPacks: Record<string, Record<string, Ingredient[]>> = {
  "Gym Pack": {
    Vanilla: [["instant pudding sugar-free vanilla", 8]],
    Chocolate: [["cocoa powder", 10]],
    PB: [["pb2", 16]],
  },
  "Dessert Pack": {
    "Cake Batter": [["instant pudding sugar-free vanilla", 10]],
    "Cinnamon Roll": [["cinnamon", 4], ["instant pudding sugar-free vanilla", 6]],
    "Chocolate Fudge": [["cocoa powder", 14]],
  },
  "Cereal Pack": {
    "Cinnamon Toast": [["cinnamon", 4], ["zero-cal sweetener", 4]],
    "Cookie Crunch": [["graham crumbs", 16]],
  },
  "Luxury Pack": {
    "Biscoff Deluxe": [["biscoff spread", 18]],
    "Cheesecake Supreme": [["pudding mix sugar-free cheesecake", 10]],
    "Choco PB Dream": [["cocoa powder", 8], ["pb2", 12]],
    "Salted Caramel Gold": [["caramel", 18], ["salt", 0.5]],
    "Banana Nut Reserve": [["banana", 60], ["pecans", 10]],
  },
};


const allPackFlavors: Record<string, Ingredient[]> = Object.values(flavorPacks).reduce(
  (acc, pack) => ({ ...acc, ...pack }),
  {} as Record<string, Ingredient[]>
);

const commonFlavors: Record<string, Ingredient[]> = {
  "Vanilla": [["instant pudding sugar-free vanilla", 8]],
  "Chocolate": [["cocoa powder", 10]],
  "Strawberry": [["strawberries", 80]],
  "Cookies & Cream": [["instant pudding sugar-free vanilla", 8]],
  "Strawberry Cheesecake": [["strawberries", 80], ["pudding mix sugar-free cheesecake", 6]],
  "Chocolate PB": [["cocoa powder", 8], ["pb2", 12]],
  "Biscoff Cheesecake": [["biscoff spread", 14], ["pudding mix sugar-free cheesecake", 6]],
  "Cinnamon Toast": [["cinnamon", 4], ["zero-cal sweetener", 4]],
  "Dark Chocolate": [["cocoa powder", 14]],
  "Brownie Batter": [["cocoa powder", 12], ["zero-cal sweetener", 5], ["salt", 0.4]],
  "Strawberry Banana": [["strawberries", 50], ["banana", 50]],
  "Cherry": [["cherries", 70]],
  "Lemon": [["lemon", 20], ["zero-cal sweetener", 4]],
  "Apple Cinnamon": [["apple", 70], ["cinnamon", 4]],
  "Chocolate Chip": [["sugar-free chocolate chips", 18]],
  "Apple": [["apple", 80]],
  "Pumpkin": [["pumpkin", 80], ["cinnamon", 3]],
  "Carrot Cake": [["cinnamon", 3], ["instant pudding sugar-free vanilla", 8]],
  "Red Velvet": [["cocoa powder", 8], ["instant pudding sugar-free vanilla", 6]],
  "Coconut": [["coconut", 12]],
  "Almond": [["vanilla extract", 3]],
  "Peach": [["peaches", 80]],
  "Smores": [["graham crumbs", 14], ["sugar-free chocolate chips", 14], ["mini marshmallows", 8]],
  "Mint": [["instant pudding sugar-free vanilla", 6]],
  "Mint Chocolate": [["cocoa powder", 8], ["sugar-free chocolate chips", 12]],
  "Chocolate Strawberry": [["cocoa powder", 8], ["strawberries", 60]],
  "Chocolate Banana": [["cocoa powder", 8], ["banana", 50]],
  "Pecan": [["pecans", 14]],
  "Caramel": [["caramel", 18]],
  "Salted Caramel": [["caramel", 18], ["salt", 0.5]],
  "Banana": [["banana", 70]],
  "Banana Nut": [["banana", 60], ["pecans", 10]],
  "Cake Batter": [["instant pudding sugar-free vanilla", 10], ["zero-cal sweetener", 4]],
  "Birthday Cake": [["instant pudding sugar-free vanilla", 10]],
};

const commonSwirls: Record<string, Ingredient[]> = {
  "Biscoff Core": [["biscoff spread", 18]],
  "Biscoff Swirl": [["biscoff spread", 14]],
  "Brownie Batter Core": [["cocoa powder", 10], ["sugar-free syrup", 16], ["zero-cal sweetener", 4]],
  "Brownie Batter Swirl": [["cocoa powder", 8], ["sugar-free syrup", 14], ["zero-cal sweetener", 3]],
  "Caramel Core": [["caramel", 20]],
  "Caramel Swirl": [["caramel", 16]],
  "Cheesecake Core": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 6]],
  "Cheesecake Layer": [["greek yogurt nonfat", 45], ["pudding mix sugar-free cheesecake", 7]],
  "Cheesecake Swirl": [["greek yogurt nonfat", 35], ["pudding mix sugar-free cheesecake", 6]],
  "Chocolate Core": [["sugar-free chocolate chips", 16]],
  "Chocolate Layer": [["cocoa powder", 10], ["sugar-free syrup", 18]],
  "Chocolate Ribbon": [["cocoa powder", 8], ["sugar-free syrup", 16]],
  "Chocolate Swirl": [["cocoa powder", 8], ["sugar-free syrup", 14]],
  "Cookie Butter Core": [["biscoff spread", 18]],
  "Cookie Butter Swirl": [["biscoff spread", 14], ["graham crumbs", 4]],
  "Fruit Jam Core": [["strawberries", 60]],
  "Fruit Jam Swirl": [["strawberries", 50]],
  "Marshmallow Core": [["mini marshmallows", 16]],
  "Marshmallow Layer": [["mini marshmallows", 20]],
  "Marshmallow Swirl": [["mini marshmallows", 14]],
  "PB Center": [["pb2", 14], ["almond milk unsweetened", 10]],
  "PB Core": [["pb2", 14], ["almond milk unsweetened", 10]],
  "PB Layer": [["pb2", 16], ["almond milk unsweetened", 12]],
  "PB Swirl": [["pb2", 12], ["almond milk unsweetened", 10]],
  "Protein Frost Swirl": [["greek yogurt nonfat", 30], ["instant pudding sugar-free vanilla", 5]],
  "Salted Caramel Core": [["caramel", 18], ["salt", 0.5]],
  "Salted Caramel Swirl": [["caramel", 14], ["salt", 0.5]],
  "Strawberry Core": [["strawberries", 60]],
  "Strawberry Swirl": [["strawberries", 50]],
  "Vanilla Cream Core": [["greek yogurt nonfat", 35], ["instant pudding sugar-free vanilla", 6]],
  "Vanilla Swirl": [["greek yogurt nonfat", 25], ["instant pudding sugar-free vanilla", 5]],
};

const commonToppings: Record<string, Ingredient[]> = {
  "Biscoff Crumbs": [["graham crumbs", 12], ["biscoff spread", 6]],
  "Biscoff Drip": [["biscoff spread", 12]],
  "Butter": [["butter", 8]],
  "Caramel Drip": [["caramel", 16]],
  "Cheesecake Frosting": [["greek yogurt nonfat", 30], ["pudding mix sugar-free cheesecake", 5]],
  "Chocolate Chips": [["sugar-free chocolate chips", 16]],
  "Chocolate Drip": [["sugar-free syrup", 16], ["cocoa powder", 4]],
  "Chocolate Frosting": [["greek yogurt nonfat", 28], ["cocoa powder", 6], ["zero-cal sweetener", 3]],
  "Cinnamon Frosting": [["greek yogurt nonfat", 28], ["cinnamon", 2], ["instant pudding sugar-free vanilla", 4]],
  "Cinnamon Sugar": [["cinnamon", 2], ["zero-cal sweetener", 4]],
  "Cookie Butter Frosting": [["greek yogurt nonfat", 24], ["biscoff spread", 8]],
  "Cookie Crunch": [["graham crumbs", 14]],
  "Crushed Cookies": [["graham crumbs", 16]],
  "Graham Crumbs": [["graham crumbs", 14]],
  "Irish Butter": [["irish butter", 8]],
  "Light Butter": [["light butter", 8]],
  "Marshmallow Drizzle": [["mini marshmallows", 12]],
  "Marshmallow Frosting": [["greek yogurt nonfat", 28], ["mini marshmallows", 10]],
  "Mini Marshmallows": [["mini marshmallows", 12]],
  "PB Chips": [["pb2", 12]],
  "PB Drip": [["pb2", 10], ["almond milk unsweetened", 10]],
  "Peanut Butter Frosting": [["greek yogurt nonfat", 26], ["pb2", 10]],
  "Pecan Topping": [["pecans", 10]],
  "Protein Frost": [["greek yogurt nonfat", 30], ["instant pudding sugar-free vanilla", 5]],
  "Salted Caramel Drip": [["caramel", 16], ["salt", 0.5]],
  "Salted Caramel Frosting": [["greek yogurt nonfat", 26], ["caramel", 10], ["salt", 0.4]],
  "Sprinkles Style": [["graham crumbs", 10], ["zero-cal sweetener", 3]],
  "Strawberry Frosting": [["greek yogurt nonfat", 28], ["strawberries", 30], ["instant pudding sugar-free vanilla", 4]],
  "Vanilla Frosting": [["greek yogurt nonfat", 30], ["instant pudding sugar-free vanilla", 5]],
  "Vanilla Glaze": [["greek yogurt nonfat", 20], ["instant pudding sugar-free vanilla", 4]],
};

const recipes: Recipe[] = [
  {
    category: "Muffins",
    name: "Base Protein Muffins",
    clientName: "Protein Muffins",
    servings: 6,
    base: [["whey isolate", 30], ["oat flour", 35], ["egg whites", 150], ["almond milk unsweetened", 60], ["baking powder", 6], ["zero-cal sweetener", 8], ["vanilla extract", 3]],
    method: [
      "Preheat oven to 350°F. Line or lightly spray a 6-slot muffin tray.",
      "Whisk dry ingredients until even.",
      "Whisk wet ingredients separately until smooth.",
      "Combine wet and dry and rest 2 minutes.",
      "Add selected flavor ingredients.",
      "Fill halfway, add swirl/core if using, then cover with remaining batter.",
      "Bake 14–18 minutes.",
      "Cool 10 minutes before removing."
    ],
    flavors: {
      Blueberry: [["blueberries", 75]],
      Chocolate: [["cocoa powder", 12]],
      "Cinnamon Roll": [["cinnamon", 4], ["instant pudding sugar-free vanilla", 8]],
      "Peanut Butter": [["pb2", 16]],
      Biscoff: [["biscoff spread", 18]]
    },
    flavorHow: {
      Blueberry: ["Fold blueberries in at the end."],
      Chocolate: ["Whisk cocoa into the dry mix before adding wet ingredients."],
      "Cinnamon Roll": ["Whisk cinnamon and pudding mix into the dry ingredients."],
      "Peanut Butter": ["Whisk PB2 into the dry mix."],
      Biscoff: ["Warm slightly and fold gently into the batter or reserve for a ribbon."]
    },
    swirls: {
      None: [],
      "Cheesecake Swirl": [["greek yogurt nonfat", 50], ["pudding mix sugar-free cheesecake", 6]],
      "Chocolate Swirl": [["sugar-free syrup", 20], ["cocoa powder", 6]],
      "Biscoff Core": [["biscoff spread", 24]],
      "PB Core": [["pb2", 14], ["almond milk unsweetened", 10]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Swirl": ["Mix yogurt and cheesecake pudding until thick.", "Spoon into each half-filled muffin and lightly twist."],
      "Chocolate Swirl": ["Mix syrup and cocoa until glossy, then drag lightly through the batter."],
      "Biscoff Core": ["Freeze small Biscoff portions for 15–20 minutes.", "Place in the center and cover completely."],
      "PB Core": ["Mix PB2 with almond milk into a thick paste.", "Freeze small portions and bury in the center."]
    },
    toppings: {
      None: [],
      "Yogurt Glaze": [["greek yogurt nonfat", 30], ["zero-cal sweetener", 3]],
      "Cinnamon Drizzle": [["sugar-free syrup", 18], ["cinnamon", 2]],
      "Chocolate Drizzle": [["sugar-free syrup", 18], ["cocoa powder", 4]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Yogurt Glaze": ["Mix until smooth and drizzle over cooled muffins."],
      "Cinnamon Drizzle": ["Mix until smooth and drizzle after cooling."],
      "Chocolate Drizzle": ["Whisk until glossy and drizzle after cooling."]
    },
    creami: [
      "Add 120ml extra almond milk and 1g xanthan gum.",
      "Freeze 20–24 hours in a pint.",
      "Spin on Lite Ice Cream and respin if needed."
    ]
  },
  {
    category: "Brownies",
    name: "Base Protein Brownies",
    clientName: "Protein Brownies",
    servings: 9,
    base: [["whey isolate", 35], ["oat flour", 30], ["cocoa powder", 18], ["egg whites", 160], ["almond milk unsweetened", 70], ["baking powder", 5], ["zero-cal sweetener", 10]],
    method: [
      "Preheat oven to 350°F and line a small square pan.",
      "Whisk dry ingredients and wet ingredients separately.",
      "Combine until glossy and pourable.",
      "Add selected flavor ingredients.",
      "Spread half the batter, build the selected swirl/core, then cover with the rest.",
      "Bake 12–16 minutes.",
      "Cool fully before slicing."
    ],
    flavors: {
      Original: [],
      "Cookies & Cream": [["instant pudding sugar-free vanilla", 8]],
      Biscoff: [["biscoff spread", 20]],
      "Double Chocolate": [["dark chocolate chips", 18]],
      "Peanut Butter": [["pb2", 18]],
      "Blueberry Cheesecake": [["blueberries", 60], ["pudding mix sugar-free cheesecake", 5]]
    },
    flavorHow: {
      Original: ["Keep the brownie base exactly as written with no added flavor ingredients for a clean original brownie version."],
      "Cookies & Cream": ["Whisk pudding mix into the dry ingredients."],
      Biscoff: ["Warm slightly and fold it in gently."],
      "Double Chocolate": ["Fold chocolate chips in at the end."],
      "Peanut Butter": ["Whisk PB2 into the dry mix."],
      "Blueberry Cheesecake": ["Whisk cheesecake pudding into the dry mix and fold blueberries in last."]
    },
    swirls: {
      None: [],
      "Cheesecake Ripple": [["greek yogurt nonfat", 60], ["pudding mix sugar-free cheesecake", 8]],
      "PB Swirl": [["pb2", 18], ["almond milk unsweetened", 15]],
      "Biscoff Core Pockets": [["biscoff spread", 30]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Ripple": ["Mix yogurt and pudding until thick.", "Dot over the half-filled pan and drag a knife through."],
      "PB Swirl": ["Mix PB2 and almond milk into a smooth paste.", "Dot over the batter and drag lightly."],
      "Biscoff Core Pockets": ["Freeze small Biscoff portions until firm and press into the half-filled batter, then cover fully."]
    },
    toppings: {
      None: [],
      "Dusting Cocoa": [["cocoa powder", 3]],
      "Yogurt Frost": [["greek yogurt nonfat", 35], ["zero-cal sweetener", 3]],
      "Chocolate Top": [["sugar-free chocolate chips", 16]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Dusting Cocoa": ["Dust after brownies cool."],
      "Yogurt Frost": ["Mix and spread over cooled brownies."],
      "Chocolate Top": ["Add after baking for melt or after cooling for texture."]
    },
    creami: [
      "Add 140ml extra almond milk and 1g xanthan gum.",
      "Freeze flat, then spin.",
      "Use PB or Biscoff after first spin for brownie batter style."
    ]
  },
  {
    category: "Cookies",
    name: "Base Protein Cookies",
    clientName: "Protein Cookies",
    servings: 8,
    base: [["whey isolate", 30], ["oat flour", 40], ["greek yogurt nonfat", 80], ["almond milk unsweetened", 20], ["baking powder", 4], ["zero-cal sweetener", 8], ["vanilla extract", 3]],
    method: [
      "Preheat oven to 350°F and line a tray.",
      "Mix dry ingredients thoroughly.",
      "Add yogurt, almond milk, and vanilla until a thick dough forms.",
      "Rest 3 minutes.",
      "Add selected flavor ingredients.",
      "For stuffed cookies, flatten dough, build the selected core, seal, and flatten lightly.",
      "Bake 9–12 minutes.",
      "Cool on the tray first so the cookies set."
    ],
    flavors: {
      "Cake Batter": [["instant pudding sugar-free vanilla", 10]],
      "Chocolate Chip": [["sugar-free chocolate chips", 24]],
      "Blueberry Muffin": [["blueberries", 55], ["cinnamon", 2]],
      "PB Cookie": [["pb2", 18]],
      "Biscoff Cookie": [["biscoff spread", 18]]
    },
    flavorHow: {
      "Cake Batter": ["Whisk pudding mix into the dry ingredients first."],
      "Chocolate Chip": ["Fold chips in last."],
      "Blueberry Muffin": ["Fold blueberries in gently at the end."],
      "PB Cookie": ["Whisk PB2 into the dry mix."],
      "Biscoff Cookie": ["Warm Biscoff slightly and fold it in gently, or reserve it for a filled center."]
    },
    swirls: {
      None: [],
      "Cheesecake Center": [["greek yogurt nonfat", 45], ["pudding mix sugar-free cheesecake", 6]],
      "Chocolate Core": [["sugar-free chocolate chips", 20]],
      "PB Swirl": [["pb2", 14], ["almond milk unsweetened", 10]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Center": ["Mix yogurt and cheesecake pudding until thick.", "Freeze small center portions, place inside flattened dough, then seal completely."],
      "Chocolate Core": ["Place chips in the middle of flattened dough and seal well."],
      "PB Swirl": ["Mix PB2 and almond milk into a drizzle.", "Swirl on top before baking or drizzle after baking."]
    },
    toppings: {
      None: [],
      "Vanilla Glaze": [["greek yogurt nonfat", 25], ["instant pudding sugar-free vanilla", 4]],
      "PB Drizzle": [["pb2", 10], ["almond milk unsweetened", 10]],
      "Cinnamon Top": [["cinnamon", 2], ["zero-cal sweetener", 2]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Vanilla Glaze": ["Mix until smooth and spoon over cooled cookies."],
      "PB Drizzle": ["Mix until glossy and drizzle after cooling."],
      "Cinnamon Top": ["Sprinkle over warm cookies."]
    },
    creami: [
      "Add 120ml extra almond milk for a cookie dough style pint.",
      "Freeze flat, spin, then add chips or cheesecake center pieces after respin."
    ]
  },
  {
    category: "Cheesecakes",
    name: "Base Protein Cheesecake",
    clientName: "Protein Cheesecake",
    servings: 6,
    base: [["greek yogurt nonfat", 220], ["light cream cheese", 100], ["whey isolate", 25], ["whole egg", 1], ["instant pudding sugar-free vanilla", 10], ["zero-cal sweetener", 10], ["vanilla extract", 3]],
    method: [
      "Preheat oven to 325°F and prep your pan or ramekins.",
      "Beat cream cheese smooth first.",
      "Mix in yogurt, whey, pudding mix, sweetener, and vanilla.",
      "Add the egg last and mix only until combined.",
      "Pour into the pan.",
      "Add selected flavor ingredients, then build the selected swirl/core.",
      "Bake 24–32 minutes until the center is just slightly jiggly.",
      "Cool fully, then chill at least 4 hours."
    ],
    flavors: {
      "Blueberry Cheesecake": [["blueberries", 80]],
      "Biscoff Cheesecake": [["biscoff spread", 24]],
      "Chocolate Cheesecake": [["cocoa powder", 12]],
      "Cinnamon Cheesecake": [["cinnamon", 4]],
      "PB Cheesecake": [["pb2", 20]]
    },
    flavorHow: {
      "Blueberry Cheesecake": ["Fold blueberries in last."],
      "Biscoff Cheesecake": ["Warm slightly and swirl in or blend directly into the batter."],
      "Chocolate Cheesecake": ["Whisk cocoa into the base before the egg."],
      "Cinnamon Cheesecake": ["Whisk cinnamon into the base for even spice."],
      "PB Cheesecake": ["Whisk PB2 in before the egg."]
    },
    swirls: {
      None: [],
      "Blueberry Swirl": [["blueberries", 50]],
      "Biscoff Swirl": [["biscoff spread", 18]],
      "Chocolate Ribbon": [["cocoa powder", 8], ["sugar-free syrup", 15]],
      "Cheesecake Core Cups": [["light cream cheese", 36], ["zero-cal sweetener", 3]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Blueberry Swirl": ["Lightly mash part of the blueberries, spoon over the batter, and drag a skewer through."],
      "Biscoff Swirl": ["Warm slightly, spoon over the top, and drag lightly through the batter."],
      "Chocolate Ribbon": ["Mix cocoa and syrup into a smooth ribbon, then streak through the top."],
      "Cheesecake Core Cups": ["Mix cream cheese and sweetener, freeze small center portions, place in ramekins halfway through filling, then cover."]
    },
    toppings: {
      None: [],
      "Yogurt Top": [["greek yogurt nonfat", 40]],
      "Crumb Top": [["graham crumbs", 16]],
      "Chocolate Chips": [["sugar-free chocolate chips", 16]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Yogurt Top": ["Spread over chilled cheesecake."],
      "Crumb Top": ["Sprinkle just before serving."],
      "Chocolate Chips": ["Top after chilling for texture or near the end of baking for slight melt."]
    },
    creami: [
      "Blend the base with 100ml almond milk until smooth.",
      "Freeze, spin once, scrape sides, then respin.",
      "Use the chosen flavor as a mix-in or add the selected swirl after the final spin."
    ]
  },
  {
    category: "Ice Cream / Creami",
    name: "Base Protein Creami Pint",
    clientName: "Protein Creami Pint",
    servings: 1,
    base: [["whey isolate", 30], ["greek yogurt nonfat", 120], ["almond milk unsweetened", 220], ["instant pudding sugar-free vanilla", 8], ["zero-cal sweetener", 6], ["xanthan gum", 1]],
    method: [
      "Blend all ingredients until completely smooth.",
      "Pour into a Creami pint and freeze flat for 20–24 hours.",
      "Spin on Lite Ice Cream.",
      "If crumbly, add 15–30ml almond milk and respin.",
      "Blend in or fold in selected flavor ingredients.",
      "Build the selected ribbon or topping after the final spin."
    ],
    flavors: {
      Blueberry: [["blueberries", 90]],
      Chocolate: [["cocoa powder", 12]],
      "Cake Batter": [["instant pudding sugar-free vanilla", 8]],
      PB: [["pb2", 18]],
      Biscoff: [["biscoff spread", 18]]
    },
    flavorHow: {
      Blueberry: ["Blend directly into the base before freezing."],
      Chocolate: ["Blend cocoa fully before freezing."],
      "Cake Batter": ["Whisk in extra vanilla pudding mix before freezing."],
      PB: ["Blend PB2 into the base before freezing."],
      Biscoff: ["Blend into the base or save for a ribbon after the final spin."]
    },
    swirls: {
      None: [],
      "Cheesecake Swirl": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]],
      "Biscoff Ribbon": [["biscoff spread", 16]],
      "Chocolate Fudge Ribbon": [["sugar-free syrup", 20], ["cocoa powder", 5]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Swirl": ["Mix yogurt and pudding until thick.", "After the final spin, dig a trench, spoon in the mixture, and run Mix-In once or fold by hand."],
      "Biscoff Ribbon": ["Warm slightly, spoon into a center trench after the final spin, and run Mix-In once."],
      "Chocolate Fudge Ribbon": ["Mix syrup and cocoa until smooth, then spoon into the center trench and lightly fold."]
    },
    toppings: {
      None: [],
      "Cookie Crumble": [["graham crumbs", 14]],
      "Chocolate Chips": [["sugar-free chocolate chips", 15]],
      "Fresh Fruit Top": [["strawberries", 70]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Cookie Crumble": ["Sprinkle over the finished pint just before eating."],
      "Chocolate Chips": ["Add after the final spin or use Mix-In once."],
      "Fresh Fruit Top": ["Top the finished pint right before serving."]
    },
    creami: [
      "This recipe is already in Creami format.",
      "For firmer texture, respin once without extra liquid first.",
      "For softer texture, add almond milk in small splashes and respin until creamy."
    ]
  },
  {
    category: "Pudding Cups",
    name: "Base Protein Pudding Cup",
    clientName: "Protein Pudding Cup",
    servings: 2,
    base: [["greek yogurt nonfat", 200], ["whey isolate", 25], ["instant pudding sugar-free vanilla", 12], ["almond milk unsweetened", 40], ["zero-cal sweetener", 4]],
    method: [
      "Whisk or blend all base ingredients until completely smooth.",
      "Rest 3–5 minutes so the pudding mix thickens.",
      "Add selected flavor ingredients.",
      "Layer into cups or jars.",
      "If using a swirl or center, add halfway through the filling process.",
      "Top as desired and chill 20–30 minutes for best texture."
    ],
    flavors: {
      Cheesecake: [["pudding mix sugar-free cheesecake", 8]],
      Chocolate: [["cocoa powder", 10]],
      Biscoff: [["biscoff spread", 16]],
      Strawberry: [["strawberries", 80]],
      PeanutButter: [["pb2", 16]]
    },
    flavorHow: {
      Cheesecake: ["Whisk cheesecake pudding mix directly into the base for a tangier, thicker finish."],
      Chocolate: ["Whisk cocoa into the base until fully dissolved."],
      Biscoff: ["Warm slightly and blend in or leave partly mixed for ribbons."],
      Strawberry: ["Fold chopped strawberries in after the base is mixed."],
      PeanutButter: ["Whisk PB2 into the pudding base until smooth." ]
    },
    swirls: {
      None: [],
      "Chocolate Ribbon": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "Biscoff Swirl": [["biscoff spread", 14]],
      "Cheesecake Center": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]],
      "PB Core": [["pb2", 12], ["almond milk unsweetened", 8]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Chocolate Ribbon": ["Whisk syrup and cocoa until glossy, then spoon it between pudding layers."],
      "Biscoff Swirl": ["Warm slightly and drizzle between layers, then lightly drag a spoon through."],
      "Cheesecake Center": ["Mix yogurt and cheesecake pudding until thick and use as the middle layer."],
      "PB Core": ["Mix PB2 and almond milk into a thick paste and place in the center of each cup before covering with the final layer."]
    },
    toppings: {
      None: [],
      "Cookie Crumbs": [["graham crumbs", 12]],
      "Chocolate Chips": [["sugar-free chocolate chips", 12]],
      "Fresh Fruit": [["strawberries", 60]],
      "Yogurt Top": [["greek yogurt nonfat", 30]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Cookie Crumbs": ["Sprinkle over the top right before serving for texture."],
      "Chocolate Chips": ["Scatter over the top after chilling."],
      "Fresh Fruit": ["Top with fresh fruit before serving."],
      "Yogurt Top": ["Spread a light top layer over the finished cups."]
    },
    creami: [
      "Add 80–100ml extra almond milk and 1g xanthan gum.",
      "Blend smooth, freeze flat, then spin for a pudding-style frozen pint.",
      "Use the selected swirl after the final spin for a layered spoonable texture."
    ]
  },
  {
    category: "Donuts",
    name: "Base Protein Donuts",
    clientName: "Base Protein Donuts",
    servings: 6,
    base: [["whey isolate", 30], ["oat flour", 35], ["egg whites", 140], ["almond milk unsweetened", 60], ["baking powder", 5], ["zero-cal sweetener", 8], ["vanilla extract", 2]],
    method: [
      "Preheat oven to 350°F and lightly grease a donut mold.",
      "Whisk dry ingredients together.",
      "Whisk wet ingredients separately until smooth.",
      "Combine and rest 2 minutes.",
      "Add selected flavor ingredients.",
      "Pipe or spoon into the mold about three-quarters full.",
      "If using a core, place it centrally and cover lightly.",
      "Bake 10–14 minutes and cool before removing."
    ],
    flavors: {
      Vanilla: [["instant pudding sugar-free vanilla", 8]],
      Chocolate: [["cocoa powder", 10]],
      Cinnamon: [["cinnamon", 3]],
      Biscoff: [["biscoff spread", 16]],
      Blueberry: [["blueberries", 55]]
    },
    flavorHow: {
      Vanilla: ["Whisk pudding mix into the dry ingredients."],
      Chocolate: ["Whisk cocoa into the dry base before adding wet."],
      Cinnamon: ["Whisk cinnamon into the base for an even spice profile."],
      Biscoff: ["Warm slightly and fold in gently or reserve for glaze/swirl."],
      Blueberry: ["Fold blueberries in gently at the end."]
    },
    swirls: {
      None: [],
      "Cheesecake Core": [["greek yogurt nonfat", 35], ["pudding mix sugar-free cheesecake", 5]],
      "Chocolate Ribbon": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "Biscoff Core": [["biscoff spread", 18]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Core": ["Mix yogurt and cheesecake pudding until thick.", "Pipe a small amount into the center of each donut and cover lightly with batter."],
      "Chocolate Ribbon": ["Mix syrup and cocoa until glossy and lightly swirl into the batter after piping."],
      "Biscoff Core": ["Freeze small Biscoff portions and place them in the center before baking."]
    },
    toppings: {
      None: [],
      Glaze: [["greek yogurt nonfat", 30], ["zero-cal sweetener", 3]],
      "Chocolate Glaze": [["greek yogurt nonfat", 25], ["cocoa powder", 4]],
      "Cinnamon Sugar Top": [["cinnamon", 2], ["zero-cal sweetener", 2]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Glaze: ["Mix until smooth and dip cooled donuts."],
      "Chocolate Glaze": ["Whisk until smooth and spoon over cooled donuts."],
      "Cinnamon Sugar Top": ["Sprinkle over warm donuts for best adhesion."]
    },
    creami: [
      "Blend the donut base with 120ml extra almond milk.",
      "Freeze and spin for a cake-donut ice cream base."
    ]
  },
  {
    category: "Pancakes",
    name: "Base Protein Pancakes",
    clientName: "Protein Pancakes",
    servings: 4,
    base: [["whey isolate", 30], ["oat flour", 40], ["egg whites", 120], ["almond milk unsweetened", 70], ["baking powder", 5], ["zero-cal sweetener", 6]],
    method: [
      "Whisk all ingredients until smooth.",
      "Let batter rest 2 minutes.",
      "Fold in selected flavor ingredients if needed.",
      "Heat a nonstick pan over medium heat.",
      "Pour batter and cook until bubbles form.",
      "Flip and cook the second side until set.",
      "Stack and add swirl/topping after cooking."
    ],
    flavors: {
      Blueberry: [["blueberries", 60]],
      Chocolate: [["cocoa powder", 10]],
      Cinnamon: [["cinnamon", 3]],
      Biscoff: [["biscoff spread", 14]],
      PB: [["pb2", 14]]
    },
    flavorHow: {
      Blueberry: ["Fold blueberries in at the end so they stay whole."],
      Chocolate: ["Whisk cocoa directly into the batter."],
      Cinnamon: ["Whisk cinnamon into the base."],
      Biscoff: ["Whisk a little into the batter or reserve for filling between stacked pancakes."],
      PB: ["Whisk PB2 into the batter. Add a small splash of milk if it thickens too much."]
    },
    swirls: {
      None: [],
      "Cheesecake Layer": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 4]],
      "Chocolate Drizzle": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "PB Center": [["pb2", 12], ["almond milk unsweetened", 8]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Layer": ["Mix yogurt and cheesecake pudding until thick, then spread between pancake layers."],
      "Chocolate Drizzle": ["Whisk syrup and cocoa until smooth and drizzle between or over stacked pancakes."],
      "PB Center": ["Mix PB2 and almond milk into a thick paste and spread between pancakes as a center layer."]
    },
    toppings: {
      None: [],
      Syrup: [["sugar-free syrup", 20]],
      Fruit: [["strawberries", 60]],
      "Yogurt Dollop": [["greek yogurt nonfat", 35]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Syrup: ["Drizzle over the stack before serving."],
      Fruit: ["Top with fruit right before eating."],
      "Yogurt Dollop": ["Add a dollop on top of the stack for a thicker finish."]
    },
    creami: [
      "Blend the pancake base with extra almond milk and freeze for a pancake-batter style pint."
    ]
  },
  {
    category: "Protein Bars",
    name: "Base Protein Bars",
    clientName: "Protein Bars",
    servings: 6,
    base: [["whey isolate", 40], ["oat flour", 40], ["pb2", 20], ["almond milk unsweetened", 40], ["zero-cal sweetener", 6]],
    method: [
      "Mix all ingredients into a thick dough.",
      "Add selected flavor ingredients.",
      "Press half the mixture into a lined container if using a center layer.",
      "Build swirl/core if selected, then press the rest of the mixture over the top.",
      "Smooth firmly and chill 1–2 hours.",
      "Slice into bars."
    ],
    flavors: {
      Chocolate: [["cocoa powder", 10]],
      Biscoff: [["biscoff spread", 18]],
      Vanilla: [["instant pudding sugar-free vanilla", 8]],
      PB: [["pb2", 12]],
      Cheesecake: [["pudding mix sugar-free cheesecake", 8]]
    },
    flavorHow: {
      Chocolate: ["Whisk cocoa into the dry mix before adding liquid."],
      Biscoff: ["Warm slightly and fold into the dough or reserve for a ribbon."],
      Vanilla: ["Whisk pudding mix into the dry base."],
      PB: ["Add extra PB2 into the dough for a stronger peanut flavor."],
      Cheesecake: ["Whisk cheesecake pudding into the mix for a tangier flavor profile."]
    },
    swirls: {
      None: [],
      "Biscoff Center": [["biscoff spread", 20]],
      "Chocolate Layer": [["cocoa powder", 6], ["almond milk unsweetened", 12]],
      "Cheesecake Layer": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Biscoff Center": ["Spread Biscoff in a thin middle layer, then press remaining bar mixture on top."],
      "Chocolate Layer": ["Mix cocoa and milk into a spreadable paste and layer in the center."],
      "Cheesecake Layer": ["Mix yogurt and cheesecake pudding until thick, then spread as the middle layer before topping with remaining bar mixture."]
    },
    toppings: {
      None: [],
      Chips: [["sugar-free chocolate chips", 15]],
      Crumbs: [["graham crumbs", 12]],
      Drizzle: [["sugar-free syrup", 15]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Chips: ["Press into the top before chilling."],
      Crumbs: ["Sprinkle onto the top layer and press lightly."],
      Drizzle: ["Drizzle after slicing for a cleaner finish."]
    },
    creami: [
      "Blend the bar base with extra almond milk for a dense cookie-bar ice cream base if desired."
    ]
  },
  {
    category: "Mug Cakes",
    name: "Base Protein Mug Cake",
    clientName: "Protein Mug Cake",
    servings: 1,
    base: [["whey isolate", 25], ["oat flour", 20], ["egg whites", 70], ["almond milk unsweetened", 30], ["baking powder", 3], ["zero-cal sweetener", 4]],
    method: [
      "Whisk all ingredients in a microwave-safe mug until smooth.",
      "Add selected flavor ingredients.",
      "If using a core, add half the batter first, place the core in the middle, then cover with remaining batter.",
      "Microwave 45–75 seconds depending on thickness and microwave power.",
      "Rest 1 minute before topping."
    ],
    flavors: {
      Chocolate: [["cocoa powder", 8]],
      Cinnamon: [["cinnamon", 2]],
      PB: [["pb2", 12]],
      Biscoff: [["biscoff spread", 12]],
      Vanilla: [["instant pudding sugar-free vanilla", 6]]
    },
    flavorHow: {
      Chocolate: ["Whisk cocoa into the base."],
      Cinnamon: ["Whisk cinnamon into the base."],
      PB: ["Whisk PB2 into the batter for a thicker cake."],
      Biscoff: ["Warm slightly and stir in lightly for ribbons."],
      Vanilla: ["Whisk pudding mix into the batter for a sweeter flavor."]
    },
    swirls: {
      None: [],
      "Chocolate Core": [["sugar-free chocolate chips", 12]],
      "PB Core": [["pb2", 10], ["almond milk unsweetened", 6]],
      "Cheesecake Swirl": [["greek yogurt nonfat", 25], ["pudding mix sugar-free cheesecake", 4]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Chocolate Core": ["Pile chips in the center after half the batter is in the mug, then cover."],
      "PB Core": ["Mix PB2 and milk into a thick paste, spoon into the center, and cover with batter."],
      "Cheesecake Swirl": ["Mix yogurt and cheesecake pudding, spoon on top, and lightly swirl before microwaving."]
    },
    toppings: {
      None: [],
      Syrup: [["sugar-free syrup", 12]],
      "Yogurt Top": [["greek yogurt nonfat", 20]],
      "Cookie Crumbs": [["graham crumbs", 8]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Syrup: ["Drizzle immediately after cooking."],
      "Yogurt Top": ["Top after a short rest so it does not melt fully."],
      "Cookie Crumbs": ["Sprinkle over the top right before serving."]
    },
    creami: [
      "Blend the mug cake base with extra almond milk and freeze for a cake-batter pint."
    ]
  },
  {
    category: "Skillets",
    name: "Base Protein Skillet",
    clientName: "Protein Skillet",
    servings: 2,
    base: [["whey isolate", 30], ["oat flour", 35], ["egg whites", 110], ["almond milk unsweetened", 45], ["baking powder", 4], ["zero-cal sweetener", 6]],
    method: [
      "Preheat oven-safe skillet or pan.",
      "Mix dry ingredients, then whisk wet ingredients separately.",
      "Combine until smooth and add selected flavor ingredients.",
      "Pour into a greased skillet.",
      "Add swirl or core if using.",
      "Cook on low stovetop heat briefly, then finish in the oven or air fryer until set.",
      "Top and serve warm."
    ],
    flavors: {
      Chocolate: [["cocoa powder", 10]],
      Blueberry: [["blueberries", 60]],
      Cinnamon: [["cinnamon", 3]],
      PB: [["pb2", 14]],
      Biscoff: [["biscoff spread", 16]]
    },
    flavorHow: {
      Chocolate: ["Whisk cocoa into the dry base."],
      Blueberry: ["Fold blueberries in last."],
      Cinnamon: ["Whisk cinnamon into the batter."],
      PB: ["Whisk PB2 into the batter."],
      Biscoff: ["Warm slightly and swirl in or reserve for the center."]
    },
    swirls: {
      None: [],
      "Cheesecake Center": [["greek yogurt nonfat", 35], ["pudding mix sugar-free cheesecake", 4]],
      "Biscoff Core": [["biscoff spread", 18]],
      "Chocolate Swirl": [["sugar-free syrup", 16], ["cocoa powder", 4]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Center": ["Place the cheesecake mixture in the middle of the skillet batter and lightly cover it."],
      "Biscoff Core": ["Freeze a small Biscoff portion and place it in the center before finishing the top layer."],
      "Chocolate Swirl": ["Drizzle the chocolate mixture through the top before cooking to create ribbon pockets."]
    },
    toppings: {
      None: [],
      Syrup: [["sugar-free syrup", 16]],
      "Yogurt Top": [["greek yogurt nonfat", 25]],
      Chips: [["sugar-free chocolate chips", 12]]
    },
    toppingHow: {
      None: ["No topping selected."],
      Syrup: ["Drizzle over the warm skillet."],
      "Yogurt Top": ["Top after the skillet cools slightly."],
      Chips: ["Sprinkle right after cooking for a partial melt."]
    },
    creami: [
      "Blend the skillet base with extra almond milk and freeze for a baked-batter style pint."
    ]
  }
  ,
  {
    category: "Rice Crispy Treats",
    name: "Base Protein Rice Crispy Treats",
    clientName: "Protein Rice Crispy Treats",
    servings: 6,
    base: [["rice krispies cereal", 40], ["whey isolate", 20], ["mini marshmallows", 35], ["light butter", 5]],
    method: [
      "Line a small loaf pan or container with parchment paper.",
      "Add the mini marshmallows and light butter to a microwave-safe bowl.",
      "Microwave in short bursts until melted, then stir until smooth and glossy.",
      "Whisk in the whey isolate quickly while the marshmallow mixture is still warm so it blends in without clumping.",
      "Fold in the selected crispy rice cereal gently so you keep as much crunch as possible.",
      "Add the selected flavor ingredients after the main mixture is evenly coated.",
      "If using a center or layer, press half the mixture into the pan first.",
      "Build the selected core or layer, then top with the remaining crispy mixture.",
      "Press lightly into the pan. Do not crush it down hard or the texture will lose crunch.",
      "Cool and set for 20–30 minutes, then finish with the selected topping and slice."
    ],
    flavors: {
      "Classic Vanilla": [["vanilla extract", 2]],
      "Just Chocolate": [["cocoa powder", 6]],
      "Birthday Cake": [["instant pudding sugar-free vanilla", 8]],
      "Peanut Butter": [["pb2", 12]],
      "Biscoff": [["biscoff spread", 14]]
    },
    flavorHow: {
      "Classic Vanilla": ["Stir the vanilla into the melted marshmallow mixture before folding in the cereal so the flavor spreads evenly."],
      "Just Chocolate": ["Use chocolate crispy rice cereal for this build. Whisk the cocoa into the warm marshmallow-protein mixture first, then fold in the chocolate cereal gently so the crunch stays intact."],
      "Birthday Cake": ["Whisk the pudding mix into the marshmallow-protein mixture first, then fold in the cereal gently."],
      "Peanut Butter": ["Whisk the PB2 into the warm marshmallow mixture before the cereal goes in. If it thickens too much, use a tiny splash of almond milk."],
      "Biscoff": ["Warm the Biscoff slightly and fold it through gently after the cereal is mixed so you keep ribbons instead of fully blending it in."]
    },
    swirls: {
      None: [],
      "Cheesecake Core": [["greek yogurt nonfat", 40], ["pudding mix sugar-free cheesecake", 5]],
      "PB Center": [["pb2", 12], ["almond milk unsweetened", 8]],
      "Biscoff Core": [["biscoff spread", 18]],
      "Marshmallow Layer": [["mini marshmallows", 14]]
    },
    swirlBuild: {
      None: ["No core or center is selected, so press the whole batch into the pan once the flavored mixture is ready."],
      "Cheesecake Core": ["Mix the yogurt and cheesecake pudding until thick.", "Press half the crispy mixture into the pan, spread the cheesecake center through the middle, then top with the remaining crispy mixture and seal the edges."],
      "PB Center": ["Mix PB2 and almond milk into a thick peanut butter-style paste.", "Keep the center away from the edges so it stays hidden when sliced."],
      "Biscoff Core": ["Warm the Biscoff just enough to make it spreadable.", "Layer it through the center after pressing the first half down, then cover with the remaining crispy mixture."],
      "Marshmallow Layer": ["Scatter the extra marshmallows across the center layer before adding the top half of the mixture.", "Press lightly so they stay inside the bars."]
    },
    toppings: {
      None: [],
      "Chocolate Drizzle": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "PB Drizzle": [["pb2", 10], ["almond milk unsweetened", 10]],
      "Biscoff Drizzle": [["biscoff spread", 12]],
      "Marshmallow Top": [["mini marshmallows", 8]]
    },
    toppingHow: {
      None: ["No topping is selected, so slice and serve once the bars are fully set."],
      "Chocolate Drizzle": ["Whisk the syrup and cocoa until smooth, then drizzle it over the top after the bars are set."],
      "PB Drizzle": ["Mix PB2 and almond milk until glossy and spoonable, then drizzle lightly over the bars after slicing or just before slicing."],
      "Biscoff Drizzle": ["Warm the Biscoff slightly and drizzle it lightly over the finished bars."],
      "Marshmallow Top": ["Scatter the marshmallows over the top after slicing, or lightly torch them if you want a toasted finish."]
    },
    creami: [
      "This recipe is designed as a crunchy bar, not as a Creami base.",
      "If you want crispy topping in a Creami pint, keep the cereal for the final topping instead of freezing it in the base."
    ]
  },
  {
    category: "Rice Crispy Treats",
    name: "Chocolate Protein Rice Crispy Treats",
    clientName: "Chocolate Protein Rice Crispy Treats",
    servings: 6,
    base: [["chocolate crispy rice cereal", 40], ["whey isolate", 20], ["mini marshmallows", 35], ["light butter", 5], ["cocoa powder", 6]],
    method: [
      "Line a small loaf pan or container with parchment paper.",
      "Add the mini marshmallows and light butter to a microwave-safe bowl.",
      "Microwave in short bursts until melted, then stir until smooth.",
      "Whisk in the whey isolate and cocoa powder quickly while the mixture is warm so both ingredients blend in smoothly.",
      "Fold in the chocolate crispy rice cereal gently so the cereal stays crisp.",
      "If using a core or layer, press half the mixture into the pan first.",
      "Build the selected core or layer, then top with the remaining cereal mixture.",
      "Press lightly into the pan so you keep the texture airy and crunchy.",
      "Cool and set 20–30 minutes before finishing with the selected topping and slicing."
    ],
    flavors: {
      "Double Chocolate": [["cocoa powder", 8]],
      "Chocolate PB": [["pb2", 12]],
      "Chocolate Biscoff": [["biscoff spread", 14]],
      "Cookies & Cream Style": [["instant pudding sugar-free vanilla", 6]]
    },
    flavorHow: {
      "Double Chocolate": ["Whisk the extra cocoa into the melted mixture before folding in the cereal."],
      "Chocolate PB": ["Whisk PB2 into the warm mixture before the cereal goes in so the peanut butter flavor spreads evenly."],
      "Chocolate Biscoff": ["Warm the Biscoff slightly and fold it through the chocolate crispy mixture gently so you keep ribbons."],
      "Cookies & Cream Style": ["Whisk the vanilla pudding mix into the chocolate marshmallow mixture before the cereal is added."]
    },
    swirls: {
      None: [],
      "PB Center": [["pb2", 12], ["almond milk unsweetened", 8]],
      "Biscoff Core": [["biscoff spread", 18]],
      "Chocolate Layer": [["sugar-free syrup", 14], ["cocoa powder", 5]]
    },
    swirlBuild: {
      None: ["No core or layer is selected, so press the whole chocolate crispy mixture into the pan once ready."],
      "PB Center": ["Mix PB2 and almond milk into a thick center and keep it in the middle so it does not leak out the sides."],
      "Biscoff Core": ["Warm the Biscoff slightly, layer it in the center after pressing the bottom half down, then cover with the remaining mixture."],
      "Chocolate Layer": ["Whisk the syrup and cocoa until glossy, then spread a thin center ribbon between the two layers."]
    },
    toppings: {
      None: [],
      "Chocolate Drizzle": [["sugar-free syrup", 16], ["cocoa powder", 4]],
      "PB Drizzle": [["pb2", 10], ["almond milk unsweetened", 10]],
      "Biscoff Drizzle": [["biscoff spread", 12]]
    },
    toppingHow: {
      None: ["No topping is selected, so slice and serve once the bars are fully set."],
      "Chocolate Drizzle": ["Whisk the syrup and cocoa until smooth, then drizzle lightly over the bars after they are set."],
      "PB Drizzle": ["Mix PB2 and almond milk until smooth and drizzle lightly over the sliced bars."],
      "Biscoff Drizzle": ["Warm the Biscoff slightly and drizzle it lightly over the bars once set."]
    },
    creami: [
      "This recipe is intended as a crunchy bar recipe, not as a frozen Creami base.",
      "For a crunchy Creami topping, add chocolate cereal as a topping after the final spin."
    ]
  }
  ,
  {
    category: "Cakes",
    name: "Base Protein Cake",
    clientName: "Protein Cake",
    servings: 8,
    base: [["whey isolate", 32], ["oat flour", 42], ["egg whites", 140], ["greek yogurt nonfat", 90], ["almond milk unsweetened", 40], ["baking powder", 6], ["zero-cal sweetener", 10], ["vanilla extract", 4]],
    method: [
      "Preheat oven to 350°F and line a 6-inch cake pan or two small layer pans.",
      "Whisk all dry ingredients first until fully even.",
      "Whisk wet ingredients separately until smooth.",
      "Combine wet and dry just until the batter is smooth and slightly thick.",
      "Mix in the selected flavor ingredients.",
      "Spread half the batter, build the chosen swirl or core if using, then top with the rest of the batter.",
      "Bake 20–28 minutes depending on pan depth.",
      "Cool fully before slicing or stacking layers."
    ],
    flavors: {
      Vanilla: [["instant pudding sugar-free vanilla", 8]],
      Chocolate: [["cocoa powder", 12]],
      "Cake Batter": [["instant pudding sugar-free vanilla", 10]],
      Birthday: [["instant pudding sugar-free vanilla", 8]],
      Biscoff: [["biscoff spread", 18]],
      "Red Velvet": [["cocoa powder", 8], ["instant pudding sugar-free vanilla", 6]],
      "Carrot Cake": [["cinnamon", 4], ["instant pudding sugar-free vanilla", 6]],
      "Strawberry Banana": [["strawberries", 40], ["banana", 40]],
      "Salted Caramel": [["caramel", 16], ["salt", 0.5]]
    },
    flavorHow: {
      Vanilla: ["Whisk the extra vanilla pudding mix into the dry ingredients first."],
      Chocolate: ["Whisk cocoa into the dry ingredients until fully even."],
      "Cake Batter": ["Whisk the pudding mix into the dry ingredients and keep the batter smooth for a classic cake-batter profile."],
      Birthday: ["Use the vanilla pudding mix to keep the base sweet and cake-like."],
      Biscoff: ["Warm slightly and fold into the batter gently so it ribbons without thinning the whole batter too much."],
      "Red Velvet": ["Whisk the cocoa and vanilla pudding into the dry ingredients first."],
      "Carrot Cake": ["Whisk cinnamon into the dry ingredients before adding the wet ingredients."],
      "Strawberry Banana": ["Fold the fruit in last so it does not overbreak the batter."],
      "Salted Caramel": ["Fold the caramel in gently and keep the salt light but noticeable."]
    },
    swirls: {
      None: [],
      "Cheesecake Layer": [["greek yogurt nonfat", 55], ["pudding mix sugar-free cheesecake", 6]],
      "Biscoff Core": [["biscoff spread", 24]],
      "PB Core": [["pb2", 16], ["almond milk unsweetened", 10]],
      "Chocolate Ribbon": [["sugar-free syrup", 18], ["cocoa powder", 6]]
    },
    swirlBuild: {
      None: ["No swirl or core selected."],
      "Cheesecake Layer": ["Mix yogurt and cheesecake pudding until thick.", "Spread it as a middle layer and keep it away from the edges."],
      "Biscoff Core": ["Freeze small portions first, place in the center of the cake batter, and cover fully."],
      "PB Core": ["Mix PB2 and almond milk into a thick paste, chill briefly, and place in the middle before sealing with batter."],
      "Chocolate Ribbon": ["Whisk syrup and cocoa until glossy, then drag a thin ribbon through the middle of the batter."]
    },
    toppings: {
      None: [],
      "Protein Frosting": [["greek yogurt nonfat", 45], ["instant pudding sugar-free vanilla", 8]],
      "Chocolate Drip": [["sugar-free syrup", 18], ["cocoa powder", 5]],
      "Biscoff Drip": [["biscoff spread", 14]],
      "PB Drip": [["pb2", 12], ["almond milk unsweetened", 10]]
    },
    toppingHow: {
      None: ["No topping selected."],
      "Protein Frosting": ["Whisk until thick, then spread once the cake is fully cool."],
      "Chocolate Drip": ["Whisk until glossy and drizzle over the cooled cake."],
      "Biscoff Drip": ["Warm slightly and drizzle over the cooled cake or between layers."],
      "PB Drip": ["Whisk until smooth and drizzle over the cooled cake."]
    },
    creami: [
      "Blend the cake base with 160ml extra almond milk and 1g xanthan gum.",
      "Freeze in a pint for 20–24 hours.",
      "Spin on Lite Ice Cream and fold cake pieces or frosting in after the respin."
    ]
  }


];


function roundAmount(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? Math.trunc(rounded) : rounded;
}

function itemsToMap(items: Ingredient[]) {
  const map = new Map<string, number>();
  for (const [name, amount] of items) {
    map.set(name, roundAmount((map.get(name) || 0) + amount));
  }
  return map;
}

function mapToItems(map: Map<string, number>): Ingredient[] {
  return Array.from(map.entries())
    .filter(([, amount]) => amount > 0)
    .map(([name, amount]) => [name, roundAmount(amount)] as Ingredient);
}

function bumpIngredient(map: Map<string, number>, name: string, delta: number) {
  const next = roundAmount((map.get(name) || 0) + delta);
  if (next <= 0) map.delete(name);
  else map.set(name, next);
}

function setMinIngredient(map: Map<string, number>, name: string, minimum: number) {
  if ((map.get(name) || 0) < minimum) map.set(name, roundAmount(minimum));
}

function hasFlavorSignal(...values: string[]) {
  const joined = values.join(" ").toLowerCase();
  return {
    biscoff: joined.includes("biscoff"),
    pb: joined.includes("pb") || joined.includes("peanut butter"),
    chocolate: joined.includes("chocolate") || joined.includes("brownie") || joined.includes("fudge") || joined.includes("dark"),
    cheesecake: joined.includes("cheesecake"),
    cinnamon: joined.includes("cinnamon"),
    fruit: joined.includes("strawberry") || joined.includes("blueberry") || joined.includes("fruit") || joined.includes("jam") || joined.includes("banana") || joined.includes("apple") || joined.includes("peach") || joined.includes("cherry") || joined.includes("lemon"),
    caramel: joined.includes("caramel"),
    nutty: joined.includes("pecan") || joined.includes("almond") || joined.includes("coconut") || joined.includes("nut"),
  };
}

function isBakedCategory(recipeCategory: string) {
  return ["Brownies", "Muffins", "Cookies", "Cheesecakes", "Cakes", "Donuts", "Pancakes", "Protein Bars", "Mug Cakes", "Skillets"].includes(recipeCategory);
}

function applyNoWheySystem(items: Ingredient[], recipeCategory: string, flavor: string, swirl: string, topping: string) {
  const map = itemsToMap(items);
  const wheyAmount = map.get("whey isolate") || 0;
  if (!wheyAmount) return mapToItems(map);

  map.delete("whey isolate");
  const signals = hasFlavorSignal(flavor, swirl, topping);

  switch (recipeCategory) {
    case "Brownies":
      bumpIngredient(map, "oat flour", wheyAmount * 0.42);
      bumpIngredient(map, "greek yogurt nonfat", wheyAmount * 0.2);
      bumpIngredient(map, "cocoa powder", signals.chocolate ? wheyAmount * 0.16 : wheyAmount * 0.08);
      bumpIngredient(map, "zero-cal sweetener", 4);
      bumpIngredient(map, "salt", 0.6);
      bumpIngredient(map, "almond milk unsweetened", -12);
      bumpIngredient(map, "egg whites", -12);
      break;
    case "Muffins":
    case "Cakes":
    case "Donuts":
    case "Pancakes":
    case "Mug Cakes":
    case "Skillets":
      bumpIngredient(map, "oat flour", wheyAmount * 0.5);
      bumpIngredient(map, "greek yogurt nonfat", wheyAmount * 0.22);
      bumpIngredient(map, "zero-cal sweetener", 3);
      bumpIngredient(map, "almond milk unsweetened", -10);
      break;
    case "Cookies":
    case "Protein Bars":
      bumpIngredient(map, "oat flour", wheyAmount * 0.46);
      bumpIngredient(map, "greek yogurt nonfat", wheyAmount * 0.12);
      bumpIngredient(map, "pb2", 6);
      bumpIngredient(map, "zero-cal sweetener", 3);
      break;
    case "Cheesecakes":
    case "Pudding Cups":
      bumpIngredient(map, "greek yogurt nonfat", wheyAmount * 0.65);
      bumpIngredient(map, "light cream cheese", wheyAmount * 0.28);
      bumpIngredient(map, "instant pudding sugar-free vanilla", 6);
      break;
    case "Ice Cream / Creami":
      bumpIngredient(map, "greek yogurt nonfat", wheyAmount * 0.6);
      bumpIngredient(map, "instant pudding sugar-free vanilla", 6);
      bumpIngredient(map, "xanthan gum", 0.4);
      break;
    case "Rice Crispy Treats":
      bumpIngredient(map, "rice krispies cereal", 12);
      bumpIngredient(map, "mini marshmallows", 6);
      break;
    default:
      bumpIngredient(map, "oat flour", wheyAmount * 0.45);
      bumpIngredient(map, "greek yogurt nonfat", wheyAmount * 0.18);
  }

  return mapToItems(map);
}

function applyGoalSystem(items: Ingredient[], recipeCategory: string, goal: Goal) {
  const map = itemsToMap(items);

  switch (goal) {
    case "Bulk":
      if (recipeCategory === "Brownies") {
        bumpIngredient(map, "oat flour", 6);
        bumpIngredient(map, "cocoa powder", 4);
        bumpIngredient(map, "greek yogurt nonfat", 10);
        bumpIngredient(map, "pb2", 8);
        bumpIngredient(map, "zero-cal sweetener", 4);
        bumpIngredient(map, "salt", 0.6);
        bumpIngredient(map, "almond milk unsweetened", -14);
        bumpIngredient(map, "egg whites", -12);
      } else if (["Muffins", "Cakes", "Donuts", "Pancakes", "Mug Cakes", "Skillets"].includes(recipeCategory)) {
        bumpIngredient(map, "oat flour", 8);
        bumpIngredient(map, "pb2", 6);
        bumpIngredient(map, "greek yogurt nonfat", 8);
        bumpIngredient(map, "zero-cal sweetener", 3);
        bumpIngredient(map, "almond milk unsweetened", -10);
      } else if (["Cookies", "Protein Bars"].includes(recipeCategory)) {
        bumpIngredient(map, "oat flour", 6);
        bumpIngredient(map, "pb2", 8);
        bumpIngredient(map, "light butter", 4);
      } else if (recipeCategory === "Cheesecakes") {
        bumpIngredient(map, "light cream cheese", 35);
        bumpIngredient(map, "graham crumbs", 10);
      } else if (recipeCategory === "Ice Cream / Creami") {
        bumpIngredient(map, "greek yogurt nonfat", 40);
        bumpIngredient(map, "pb2", 8);
        bumpIngredient(map, "xanthan gum", 0.2);
      } else if (recipeCategory === "Pudding Cups") {
        bumpIngredient(map, "light cream cheese", 20);
        bumpIngredient(map, "pb2", 6);
      } else if (recipeCategory === "Rice Crispy Treats") {
        bumpIngredient(map, "rice krispies cereal", 10);
        bumpIngredient(map, "mini marshmallows", 8);
        bumpIngredient(map, "light butter", 3);
      }
      break;
    case "Anabolic":
      if (recipeCategory === "Brownies") {
        bumpIngredient(map, "whey isolate", 8);
        bumpIngredient(map, "egg whites", 18);
        bumpIngredient(map, "greek yogurt nonfat", 8);
        bumpIngredient(map, "almond milk unsweetened", -8);
      } else if (["Muffins", "Cakes", "Donuts", "Pancakes", "Mug Cakes", "Skillets"].includes(recipeCategory)) {
        bumpIngredient(map, "whey isolate", 8);
        bumpIngredient(map, "egg whites", 14);
        bumpIngredient(map, "almond milk unsweetened", -8);
      } else if (["Cookies", "Protein Bars"].includes(recipeCategory)) {
        bumpIngredient(map, "whey isolate", 10);
        bumpIngredient(map, "pb2", 4);
      } else if (["Cheesecakes", "Pudding Cups", "Ice Cream / Creami"].includes(recipeCategory)) {
        bumpIngredient(map, "whey isolate", 8);
        bumpIngredient(map, "greek yogurt nonfat", 20);
      }
      break;
    case "Low Cal":
      if (recipeCategory === "Brownies") {
        bumpIngredient(map, "oat flour", -6);
        bumpIngredient(map, "pb2", -4);
        bumpIngredient(map, "greek yogurt nonfat", 8);
        bumpIngredient(map, "cocoa powder", 2);
      } else if (["Muffins", "Cakes", "Donuts", "Pancakes", "Mug Cakes", "Skillets"].includes(recipeCategory)) {
        bumpIngredient(map, "oat flour", -6);
        bumpIngredient(map, "pb2", -4);
        bumpIngredient(map, "greek yogurt nonfat", 10);
      } else if (["Cookies", "Protein Bars"].includes(recipeCategory)) {
        bumpIngredient(map, "light butter", -4);
        bumpIngredient(map, "pb2", -5);
        bumpIngredient(map, "oat flour", -5);
      } else if (recipeCategory === "Cheesecakes") {
        bumpIngredient(map, "light cream cheese", -18);
        bumpIngredient(map, "greek yogurt nonfat", 18);
      } else if (recipeCategory === "Ice Cream / Creami") {
        bumpIngredient(map, "greek yogurt nonfat", -10);
        bumpIngredient(map, "almond milk unsweetened", 20);
      }
      break;
    case "No Sugar":
      bumpIngredient(map, "biscoff spread", -6);
      bumpIngredient(map, "dark chocolate chips", -8);
      bumpIngredient(map, "sugar-free chocolate chips", -4);
      bumpIngredient(map, "mini marshmallows", -8);
      bumpIngredient(map, "graham crumbs", -6);
      bumpIngredient(map, "zero-cal sweetener", 4);
      if (isBakedCategory(recipeCategory)) bumpIngredient(map, "greek yogurt nonfat", 8);
      break;
    case "Lean":
    default:
      if (isBakedCategory(recipeCategory)) {
        bumpIngredient(map, "salt", 0.4);
      }
      break;
  }

  return mapToItems(map);
}

function applyFlavorSupportSystem(items: Ingredient[], recipeCategory: string, flavor: string, swirl: string, topping: string) {
  const map = itemsToMap(items);
  const signals = hasFlavorSignal(flavor, swirl, topping);

  if (signals.biscoff) {
    bumpIngredient(map, "biscoff spread", 5);
    bumpIngredient(map, "cinnamon", 1);
    bumpIngredient(map, "salt", 0.4);
  }
  if (signals.pb) {
    bumpIngredient(map, "pb2", 6);
    bumpIngredient(map, "salt", 0.3);
  }
  if (signals.chocolate) {
    bumpIngredient(map, "cocoa powder", recipeCategory === "Brownies" ? 4 : 2);
    bumpIngredient(map, "zero-cal sweetener", 2);
    bumpIngredient(map, "salt", 0.2);
  }
  if (signals.cheesecake) {
    bumpIngredient(map, "pudding mix sugar-free cheesecake", 4);
  }
  if (signals.cinnamon) {
    bumpIngredient(map, "cinnamon", 1);
  }
  if (signals.fruit) {
    bumpIngredient(map, "zero-cal sweetener", 2);
  }
  if (signals.caramel) {
    bumpIngredient(map, "caramel", 4);
    bumpIngredient(map, "salt", 0.2);
  }
  if (signals.nutty) {
    bumpIngredient(map, "pb2", 2);
  }

  return mapToItems(map);
}

function applyTextureSystem(items: Ingredient[], recipeCategory: string, goal: Goal, proteinMode: ProteinMode) {
  const map = itemsToMap(items);

  if (recipeCategory === "Brownies") {
    setMinIngredient(map, "cocoa powder", 22);
    setMinIngredient(map, "salt", 1);
    if ((map.get("egg whites") || 0) > 135) bumpIngredient(map, "egg whites", -(map.get("egg whites")! - 135));
    if ((map.get("almond milk unsweetened") || 0) > 55) bumpIngredient(map, "almond milk unsweetened", -10);
    if ((map.get("oat flour") || 0) < 34) bumpIngredient(map, "oat flour", 4);
    if (goal === "Bulk") setMinIngredient(map, "pb2", 6);
    if (proteinMode === "No Whey") setMinIngredient(map, "greek yogurt nonfat", 18);
  }

  if (["Muffins", "Donuts", "Pancakes", "Mug Cakes", "Skillets"].includes(recipeCategory)) {
    if ((map.get("almond milk unsweetened") || 0) > 55) bumpIngredient(map, "almond milk unsweetened", -8);
    setMinIngredient(map, "oat flour", 34);
    if (proteinMode === "No Whey") setMinIngredient(map, "greek yogurt nonfat", 16);
  }

  if (["Cookies", "Protein Bars"].includes(recipeCategory)) {
    if ((map.get("almond milk unsweetened") || 0) > 35) bumpIngredient(map, "almond milk unsweetened", -6);
    setMinIngredient(map, "pb2", 8);
  }

  if (recipeCategory === "Cheesecakes") {
    setMinIngredient(map, "light cream cheese", 90);
    setMinIngredient(map, "instant pudding sugar-free vanilla", 8);
  }

  if (recipeCategory === "Ice Cream / Creami") {
    setMinIngredient(map, "xanthan gum", 1);
  }

  return mapToItems(map);
}

function buildSystemNotes(recipeCategory: string, goal: Goal, proteinMode: ProteinMode, flavor: string, swirl: string, topping: string) {
  const notes: string[] = [];
  const warnings: string[] = [];
  const signals = hasFlavorSignal(flavor, swirl, topping);

  if (recipeCategory === "Brownies") {
    notes.push("Brownies now cap excess liquid and force a stronger cocoa + salt base so the flavor is not washed out.");
  }
  if (recipeCategory === "Cakes") {
    notes.push("Cakes now keep a thicker batter path so layers hold shape and the flavor carries through the crumb instead of tasting flat.");
  }
  if (proteinMode === "No Whey") {
    notes.push("No Whey mode now removes whey completely and replaces it with recipe-specific structure and moisture ingredients.");
  }
  if (goal === "Bulk") {
    notes.push("Bulk mode now adds solids and richness instead of just adding more liquid, so the batter stays thicker and more flavorful.");
  }
  if (signals.biscoff) {
    notes.push("Biscoff builds now get base flavor support so the center does not get lost behind the brownie or muffin base.");
  }
  if (signals.pb) {
    notes.push("Peanut butter builds get extra salt and PB support in the base so the topping tastes connected instead of separate.");
  }
  if (topping !== "None" && isBakedCategory(recipeCategory)) {
    warnings.push("Apply the topping after baking or chilling so the finish stays bold and does not melt into the base.");
  }
  if (swirl.toLowerCase().includes("core") || swirl.toLowerCase().includes("center")) {
    warnings.push("Freeze or thicken the core first so it stays centered and does not bleed into the batter.");
  }

  return { notes, warnings };
}

function scaleItems(items: Ingredient[], factor: number) {
  return items.map(([name, amt]) => {
    const unit = db[name].unit;
    if (unit === "unit") return [name, Math.max(1, Math.round(amt * factor))] as Ingredient;
    return [name, roundAmount(amt * factor)] as Ingredient;
  });
}

function calcMacros(items: Ingredient[]): Macro {
  return items.reduce(
    (acc, [name, amt]) => {
      const item = db[name];
      acc.cal += item.cal * amt;
      acc.p += item.p * amt;
      acc.c += item.c * amt;
      acc.f += item.f * amt;
      return acc;
    },
    { cal: 0, p: 0, c: 0, f: 0 }
  );
}

function addMacros(a: Macro, b: Macro): Macro {
  return { cal: a.cal + b.cal, p: a.p + b.p, c: a.c + b.c, f: a.f + b.f };
}

function divideMacros(m: Macro, servings: number): Macro {
  return { cal: m.cal / servings, p: m.p / servings, c: m.c / servings, f: m.f / servings };
}

function fmt(m: Macro) {
  return `${Math.round(m.cal)} cal • P ${m.p.toFixed(1)}g • C ${m.c.toFixed(1)}g • F ${m.f.toFixed(1)}g`;
}

function ingredientLine([name, amt]: Ingredient) {
  const unit = db[name].unit === "unit" ? "" : db[name].unit;
  return `${amt}${unit} ${name}`.trim();
}

function makeSavedId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function exportBrandedHTML(
  title: string,
  goal: Goal,
  servings: number,
  totalMacros: Macro,
  perServing: Macro,
  flavor: string,
  swirl: string,
  topping: string,
  baseList: Ingredient[],
  flavorList: Ingredient[],
  swirlList: Ingredient[],
  toppingList: Ingredient[],
  method: string[],
  flavorHow: string[],
  swirlHow: string[],
  toppingHow: string[],
  creami: string[]
) {
  const w = window.open("", "_blank", "width=900,height=1200");
  if (!w) return;

  const html = `
  <html>
    <head>
      <title>${title}</title>
      <style>
        body{background:#090909;color:#f5efe0;font-family:Arial,sans-serif;padding:24px}
        .wrap{max-width:900px;margin:0 auto}
        .card{border:1px solid rgba(212,175,55,.35);border-radius:18px;padding:18px;margin-bottom:16px;background:#111}
        h1,h2{color:#d4af37}
        .pill{display:inline-block;padding:8px 12px;border:1px solid rgba(212,175,55,.35);border-radius:999px;margin:0 8px 8px 0}
        ul,ol{line-height:1.6}
        .small{color:#c6c0b2}
      </style>
    </head>
    <body>
      <div class="wrap">
        <div style="text-align:center;margin-bottom:18px;"><img src="${window.location.origin}/logo-main.svg" alt="Sclass Fitness" style="height:64px;max-width:100%;object-fit:contain;" /></div>
        <h1>${title}</h1>
        <div class="small">${BRAND.name} • ${goal}</div>

        <div class="card">
          <div class="pill">Flavor: ${flavor}</div>
          <div class="pill">Swirl / Core: ${swirl}</div>
          <div class="pill">Topping: ${topping}</div>
          <div style="margin-top:8px">Per Serving: ${fmt(perServing)}</div>
          <div class="small">Batch: ${fmt(totalMacros)} • Servings: ${servings}</div>
        </div>

        <div class="card"><h2>Base Ingredients</h2><ul>${baseList.map((x) => `<li>${ingredientLine(x)}</li>`).join("")}</ul></div>
        <div class="card"><h2>Flavor Ingredients</h2><ul>${flavorList.length ? flavorList.map((x) => `<li>${ingredientLine(x)}</li>`).join("") : "<li>None</li>"}</ul></div>
        <div class="card"><h2>Swirl / Core Ingredients</h2><ul>${swirlList.length ? swirlList.map((x) => `<li>${ingredientLine(x)}</li>`).join("") : "<li>None</li>"}</ul></div>
        <div class="card"><h2>Topping Ingredients</h2><ul>${toppingList.length ? toppingList.map((x) => `<li>${ingredientLine(x)}</li>`).join("") : "<li>None</li>"}</ul></div>
        <div class="card"><h2>Main Method</h2><ol>${method.map((x) => `<li>${x}</li>`).join("")}</ol></div>
        <div class="card"><h2>Flavor Build Method</h2><ul>${flavorHow.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="card"><h2>Swirl / Core Build Method</h2><ul>${swirlHow.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="card"><h2>Topping Method</h2><ul>${toppingHow.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div class="card"><h2>Ninja Creami Conversion</h2><ul>${creami.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      </div>
    </body>
  </html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
}


function getRecipeType(recipeName: string) {
  const n = recipeName.toLowerCase();
  if (n.includes("muffin")) return "muffin";
  if (n.includes("brownie")) return "brownie";
  if (n.includes("cookie")) return "cookie";
  if (n.includes("cake")) return "cake";
  if (n.includes("cheesecake")) return "cheesecake";
  if (n.includes("creami") || n.includes("ice cream") || n.includes("pint")) return "creami";
  if (n.includes("pudding")) return "pudding";
  if (n.includes("donut")) return "donut";
  if (n.includes("pancake")) return "pancake";
  if (n.includes("bar")) return "bar";
  if (n.includes("mug cake")) return "mug";
  if (n.includes("skillet")) return "skillet";
  return "general";
}

function getDetailedGuide(recipeName: string, flavor: string, swirl: string, topping: string) {
  const recipeType = getRecipeType(recipeName);
  const swirlName = swirl.toLowerCase();
  const toppingName = topping.toLowerCase();

  const flavorGuide = [
    `Mix the base first until it is fully smooth before adding the ${flavor} ingredients.`,
    "If the flavor uses powders like cocoa, pudding mix, or PB2, whisk them in completely so there are no dry pockets.",
    "If the flavor uses fruit, chips, or spreads, fold those in last with a spoon or spatula so the texture stays clean.",
    ...(recipeType === "muffin" ? [
      "For muffins, mix only until the batter looks even. Overmixing makes them dense.",
      "If using berries or chips, fold them in gently right before portioning the batter."
    ] : []),
    ...(recipeType === "brownie" ? [
      "For brownies, keep the batter glossy and slightly thick. Stop mixing once the flavor is evenly distributed.",
      "If using chips or chunks, fold them in last so they stay visible in the finished brownies."
    ] : []),
    ...(recipeType === "cookie" ? [
      "For cookies, the dough should stay thick enough to scoop, flatten, or roll in your hands.",
      "If the dough softens too much after adding the flavor, let it rest 2–3 minutes before shaping."
    ] : []),
    ...(recipeType === "cake" ? [
      "For cakes, keep the batter smooth and slightly thick so it can support a swirl, layer, or center without sinking.",
      "Do not overmix once the batter is smooth or the final cake can bake up tight instead of soft."
    ] : []),
    ...(recipeType === "cheesecake" ? [
      "For cheesecake, add the flavor before the egg when possible, then mix the egg in last just until combined.",
      "Do not whip too much air into cheesecake batter or the texture can turn airy instead of creamy."
    ] : []),
    ...(recipeType === "creami" ? [
      "For Creami pints, blend flavor ingredients fully before freezing unless you want them to stay as a post-spin mix-in.",
      "If using fruit, blending it smooth before freezing gives the cleanest texture."
    ] : []),
    ...(recipeType === "pudding" ? [
      "For pudding cups, whisk until smooth, then let the mixture thicken for a few minutes before layering anything else.",
    ] : []),
    ...(recipeType === "donut" ? [
      "For donuts, keep the batter thick enough to pipe or spoon cleanly into the mold.",
    ] : []),
    ...(recipeType === "pancake" ? [
      "For pancakes, let the batter rest 2 minutes before cooking so it thickens slightly and cooks more evenly.",
    ] : []),
    ...(recipeType === "bar" ? [
      "For bars, the mixture should feel like a thick dough rather than a pourable batter.",
    ] : []),
    ...(recipeType === "mug" ? [
      "For mug cakes, keep the batter thick enough to hold the center in place once microwaved.",
    ] : []),
    ...(recipeType === "skillet" ? [
      "For skillets, keep the batter spreadable but not runny so the center stays soft without sinking.",
    ] : []),
  ];

  let swirlGuide: string[] = [];
  if (swirl === "None") {
    swirlGuide = [
      "No swirl or core is selected for this build.",
      "Once your flavor is mixed in evenly, continue straight to baking, chilling, freezing, or spinning.",
    ];
  } else if (recipeType === "cookie" && (swirlName.includes("core") || swirlName.includes("center"))) {
    swirlGuide = [
      `Make the ${swirl} separately first until it is thick enough to hold shape.`,
      "Flatten some dough in your hand, place the filling in the middle, then cover it with more dough.",
      "Pinch all seams shut so the filling is fully sealed before baking.",
      "If the center shows through, patch it with extra dough so it does not leak.",
    ];
  } else if ((recipeType === "muffin" || recipeType === "brownie" || recipeType === "donut" || recipeType === "mug" || recipeType === "skillet") && (swirlName.includes("core") || swirlName.includes("center"))) {
    swirlGuide = [
      `Make the ${swirl} separately first until it is thicker than the main batter.`,
      "If it is soft, freeze it for 10–20 minutes so it is easier to place cleanly.",
      "Fill the mold, cup, pan, or skillet halfway with the main batter.",
      "Place the core directly in the center, not touching the sides.",
      "Cover fully with the remaining batter so the core stays hidden and does not leak out.",
    ];
  } else if (recipeType === "cheesecake" && (swirlName.includes("swirl") || swirlName.includes("ribbon") || swirlName.includes("ripple"))) {
    swirlGuide = [
      `Make the ${swirl} separately until smooth or lightly thickened.`,
      "Pour the cheesecake batter first.",
      "Spoon the swirl over the top in dots or short lines.",
      "Drag a knife or skewer through it only 2–4 times for a defined ripple effect.",
      "Do not overmix or the swirl will disappear into the batter.",
    ];
  } else if (recipeType === "creami") {
    swirlGuide = [
      `Prepare the ${swirl} separately before serving.`,
      "Spin the pint first until creamy.",
      "Use a spoon to make a trench down the center of the pint.",
      "Spoon the swirl or ribbon into that trench.",
      "Run Mix-In once if you want it lightly distributed, or fold it in by hand if you want stronger ribbons.",
    ];
  } else if (recipeType === "pudding") {
    swirlGuide = [
      `Prepare the ${swirl} separately until smooth or thick.`,
      "Fill the cup halfway with pudding.",
      "Add the swirl or center in the middle layer.",
      "Cover with the remaining pudding so you get a visible layered effect when spooning through it.",
    ];
  } else if (recipeType === "bar") {
    swirlGuide = [
      `Make the ${swirl} separately first.`,
      "Press half of the bar mixture into the container.",
      "Spread or place the center over the middle layer, keeping it slightly away from the edges.",
      "Press the remaining bar mixture on top and smooth firmly so the bars slice cleanly later.",
    ];
  } else if (swirlName.includes("swirl") || swirlName.includes("ribbon") || swirlName.includes("ripple") || swirlName.includes("drizzle")) {
    swirlGuide = [
      `Make the ${swirl} separately until smooth and slightly thick, not watery.`,
      "Add it in thin lines or small dots across the top or middle layer.",
      "Drag a knife, skewer, or spoon handle through it only a few times.",
      "Stop as soon as you see a visible pattern. Overmixing will erase the swirl.",
    ];
  } else {
    swirlGuide = [
      `Prepare the ${swirl} separately first.`,
      "Keep it slightly thicker than the main mixture so it stays visible in the finished recipe.",
      "Layer it carefully and avoid mixing it fully into the batter.",
    ];
  }

  let toppingGuide: string[] = [];
  if (topping === "None") {
    toppingGuide = [
      "No topping is selected for this build.",
      "Let the final texture set properly before eating or slicing.",
    ];
  } else if (recipeType === "creami") {
    toppingGuide = [
      `Add the ${topping} only after the final spin.`,
      "If it is crunchy, sprinkle it on top right before eating so it stays crisp.",
      "If it is a drizzle, spoon it slowly over the finished pint or into a trench for ribbon pockets.",
    ];
  } else if (recipeType === "cheesecake" || recipeType === "pudding") {
    toppingGuide = [
      `Add the ${topping} after the dessert is fully chilled and set.`,
      "For yogurt or frosting-style toppings, spread gently with the back of a spoon.",
      "For crumbs, chips, or fruit, add them last so the texture stays distinct.",
    ];
  } else {
    toppingGuide = [
      `Apply the ${topping} after the recipe is cooked or fully set unless the recipe specifically says otherwise.`,
      "If it is a drizzle or glaze, stir until smooth first, then spoon or drizzle it slowly over the top.",
      "If it includes crumbs, chips, or fruit, scatter them evenly at the end for the cleanest finish.",
      "Let warm recipes cool 2–5 minutes before topping so everything does not melt straight into the surface.",
    ];
  }

  const textureTips = [
    "If a core is too runny, thicken it or freeze it briefly before using it.",
    "If the batter feels too thin, let it sit 1–3 minutes so the powders hydrate before filling or layering.",
    "If the swirl disappears, you mixed too aggressively or too long.",
    "If the center leaks, it was too close to the edge or was not fully covered.",
    "For cleaner layers and cores, a spoon or piping bag works better than pouring freehand.",
  ];

  return { flavorGuide, swirlGuide, toppingGuide, textureTips, recipeType };
}


export default function SclassRecipeAppFinal() {
  const [goal, setGoal] = useState<Goal>("Lean");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [pack, setPack] = useState<string>("All Packs");
  const [clientMode, setClientMode] = useState(false);
  const [proteinMode, setProteinMode] = useState<ProteinMode>("Whey");
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sclass-saved-builds");
      if (raw) setSavedBuilds(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("sclass-saved-builds", JSON.stringify(savedBuilds));
  }, [savedBuilds]);


  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredRecipes = useMemo(() => {
    const q = query.trim().toLowerCase();

    return recipes.filter((r) => {
      const categoryMatch = category === "All" || r.category === category;
      if (!q) return categoryMatch;

      const searchableTerms = [
        r.name,
        r.clientName,
        r.category,
        ...Object.keys(r.flavors),
        ...Object.keys(r.swirls),
        ...Object.keys(r.toppings),
        ...Object.keys(commonFlavors),
        ...Object.keys(commonSwirls),
        ...Object.keys(commonToppings),
        ...Object.keys(allPackFlavors),
        ...Object.keys(flavorPacks),
      ].map((x) => x.toLowerCase());

      const textMatch = searchableTerms.some((term) => term.includes(q));
      return categoryMatch && textMatch;
    });
  }, [category, query]);

  const categories = ["All", ...Array.from(new Set(recipes.map((r) => r.category)))];
  const packOptions = ["All Packs", ...Object.keys(flavorPacks)];

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(215,176,75,0.14),_transparent_30%),linear-gradient(180deg,#080808,#020202)]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.72, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
              <motion.img
                src={BRAND.logos.mark}
                alt="Sclass Fitness"
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{
                  opacity: 1,
                  scale: [0.92, 1.05, 1],
                }}
                transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                className="h-28 w-28 object-contain drop-shadow-[0_0_28px_rgba(215,176,75,0.22)] sm:h-36 sm:w-36 md:h-44 md:w-44"
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-6 text-center"
              >
                <div className="text-[11px] uppercase tracking-[0.42em] text-yellow-500">Sclass Fitness</div>
                <div className="mt-2 text-sm text-neutral-400">Recipe Vault</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative overflow-hidden rounded-3xl border border-yellow-700/40 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.16),_transparent_28%),linear-gradient(180deg,rgba(23,23,23,1),rgba(10,10,10,1))] shadow-2xl">
            <img src={BRAND.logos.mark} alt="" className="pointer-events-none absolute right-4 top-4 h-24 w-24 opacity-[0.07] sm:h-28 sm:w-28" />
            <div className="border-b border-yellow-700/20 px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img src={BRAND.logos.main} alt={BRAND.name} className="h-24 w-auto object-contain sm:h-28" />
                    <div>
                      <div className="mb-2 text-[11px] uppercase tracking-[0.35em] text-yellow-500">{BRAND.tag}</div>
                      <h1 className="text-3xl font-bold leading-tight text-yellow-300 sm:text-4xl md:text-5xl">
                        {clientMode ? "Sclass Client Recipe Builder" : BRAND.appName}
                      </h1>
                      <p className="mt-3 max-w-2xl text-sm text-neutral-300 sm:text-base">
                        Premium branded recipe system with dynamic macros, flavor packs, saved builds, branded export,
                        a simplified client mode, working search, and full All Packs flavor expansion.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge icon={<BookOpen className="h-3.5 w-3.5" />} label="Sclass Cookbook Builder" />
                    <Badge icon={<Wand2 className="h-3.5 w-3.5" />} label="Luxury Flavor Expansion" />
                    <Badge icon={<Calculator className="h-3.5 w-3.5" />} label="Auto Macros" />
                    <Badge icon={<ChefHat className="h-3.5 w-3.5" />} label="Rice Crispy Elite" />
                    <Badge icon={<Users className="h-3.5 w-3.5" />} label="No Whey Goals" />
                  </div>
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[920px] xl:grid-cols-5">
                  <ControlCard label="Goal">
                    <AppSelect value={goal} onChange={(e) => setGoal(e.target.value as Goal)} options={goalOptions} />
                  </ControlCard>
                  <ControlCard label="Category">
                    <AppSelect value={category} onChange={(e) => setCategory(e.target.value)} options={categories} />
                  </ControlCard>
                  <ControlCard label="Flavor Pack">
                    <AppSelect value={pack} onChange={(e) => setPack(e.target.value)} options={packOptions} />
                  </ControlCard>
                  <ControlCard label="Search">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Flavor or recipe"
                        className="h-12 w-full rounded-2xl border border-yellow-700/40 bg-neutral-900 pl-10 pr-4 text-white outline-none transition focus:border-yellow-500"
                      />
                    </div>
                  </ControlCard>
                  <ControlCard label="Protein Source">
                    <AppSelect value={proteinMode} onChange={(e) => setProteinMode(e.target.value as ProteinMode)} options={["Whey", "No Whey"]} />
                  </ControlCard>

                  <div className="sm:col-span-2 xl:col-span-4">
                    <div className="flex items-center justify-between rounded-2xl border border-yellow-700/30 bg-neutral-900 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-yellow-500/10 p-2 text-yellow-400">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs text-neutral-400">Mode</div>
                          <div className="text-sm font-medium text-yellow-300">{clientMode ? "Client" : "Coach"}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setClientMode((v) => !v)}
                        className={`relative h-8 w-16 rounded-full border transition ${
                          clientMode ? "border-yellow-500 bg-yellow-500/20" : "border-neutral-700 bg-neutral-800"
                        }`}
                        aria-label="Toggle mode"
                      >
                        <span
                          className={`absolute top-1 h-6 w-6 rounded-full bg-yellow-400 transition ${
                            clientMode ? "left-9" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className={`mt-6 grid gap-6 ${clientMode ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(290px,1fr)]"}`}>
          <div className="space-y-6">
            {filteredRecipes.map((recipe, idx) => (
              <RecipeCard
                key={recipe.name}
                recipe={recipe}
                goal={goal}
                pack={pack}
                proteinMode={proteinMode}
                index={idx}
                clientMode={clientMode}
                savedBuilds={savedBuilds}
                setSavedBuilds={setSavedBuilds}
              />
            ))}
          </div>

          {!clientMode && (
            <aside className="space-y-6">
              <Panel title="Sclass Saved Builds" icon={<Save className="h-5 w-5" />}>
                <div className="space-y-3">
                  {savedBuilds.length === 0 ? (
                    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/60 p-4 text-sm text-neutral-400">
                      No saved builds yet.
                    </div>
                  ) : (
                    savedBuilds.map((build) => (
                      <div key={build.id} className="rounded-2xl border border-yellow-700/20 bg-neutral-900/70 p-3">
                        <div className="text-sm font-semibold text-yellow-300">{build.customName || build.recipeName}</div>
                        <div className="mt-1 text-xs text-neutral-400">
                          {build.goal} • {build.flavor} • {build.swirl} • {build.topping}
                        </div>
                        <button
                          onClick={() => setSavedBuilds((prev) => prev.filter((x) => x.id !== build.id))}
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-800/40 bg-neutral-950 px-3 py-2 text-sm text-white transition hover:border-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            </aside>
          )}
        </div>
        <div className="mt-8 rounded-3xl border border-yellow-700/25 bg-neutral-950/90 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img src={BRAND.logos.online} alt="Sclass Online Coaching" className="h-16 w-auto object-contain opacity-95" />
              <div>
                <div className="text-sm font-semibold text-yellow-300">Built for {BRAND.name}</div>
                <div className="text-sm text-neutral-400">Luxury coaching aesthetic • premium recipe delivery • branded client experience • splash screen included</div>
              </div>
            </div>
            <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/80 px-4 py-3 text-xs uppercase tracking-[0.28em] text-neutral-400">
              Coach Sclass Master Edition
            </div>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}


function RecipeCard({
  recipe,
  goal,
  pack,
  proteinMode,
  index,
  clientMode,
  savedBuilds,
  setSavedBuilds,
}: {
  recipe: Recipe;
  goal: Goal;
  pack: string;
  proteinMode: ProteinMode;
  index: number;
  clientMode: boolean;
  savedBuilds: SavedBuild[];
  setSavedBuilds: React.Dispatch<React.SetStateAction<SavedBuild[]>>;
}) {
  const packFlavors = pack === "All Packs" ? allPackFlavors : flavorPacks[pack] || {};
  const globalButterToppings: Record<string, Ingredient[]> = {
    Butter: [["butter", 8]],
    "Irish Butter": [["irish butter", 8]],
    "Light Butter": [["light butter", 8]],
  };

  const mergedFlavors = useMemo(
    () => ({ None: [], ...recipe.flavors, ...commonFlavors, ...packFlavors }),
    [recipe, pack]
  );
  const mergedSwirls = useMemo(
    () => ({ None: [], ...recipe.swirls, ...commonSwirls }),
    [recipe]
  );
  const mergedToppings = useMemo(
    () => ({ None: [], ...recipe.toppings, ...commonToppings, ...globalButterToppings }),
    [recipe]
  );

  const sortNoneFirst = (arr: string[]) =>
    Array.from(new Set(arr)).sort((a, b) => {
      if (a === "None") return -1;
      if (b === "None") return 1;
      return a.localeCompare(b);
    });

  const flavorKeys = sortNoneFirst(Object.keys(mergedFlavors));
  const swirlOnlyKeys = sortNoneFirst(
    Object.keys(mergedSwirls).filter((k) =>
      k === "None" || /(swirl|ripple|ribbon|layer)/i.test(k)
    )
  );
  const coreOnlyKeys = sortNoneFirst(
    Object.keys(mergedSwirls).filter((k) =>
      k === "None" || /(core|center|pocket|cups)/i.test(k)
    )
  );
  const dripKeys = sortNoneFirst(
    Object.keys(mergedToppings).filter((k) =>
      k === "None" || /(drip|glaze|frost|top)$/i.test(k)
    )
  );
  const toppingKeys = sortNoneFirst(
    Object.keys(mergedToppings).filter((k) =>
      k === "None" || !/(drip|glaze|frost|top)$/i.test(k)
    )
  );

  const [flavor1, setFlavor1] = useState(flavorKeys[0] || "None");
  const [flavor2, setFlavor2] = useState("None");
  const [splitMode, setSplitMode] = useState<"Single" | "50/50" | "Layered" | "Swirl">("Single");
  const [swirl, setSwirl] = useState(swirlOnlyKeys[0] || "None");
  const [core, setCore] = useState(coreOnlyKeys[0] || "None");
  const [topping, setTopping] = useState(toppingKeys[0] || "None");
  const [drip, setDrip] = useState(dripKeys[0] || "None");
  const [cakeLayers, setCakeLayers] = useState("1");
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    if (!flavorKeys.includes(flavor1)) setFlavor1(flavorKeys[0] || "None");
    if (!flavorKeys.includes(flavor2)) setFlavor2("None");
    if (!swirlOnlyKeys.includes(swirl)) setSwirl(swirlOnlyKeys[0] || "None");
    if (!coreOnlyKeys.includes(core)) setCore(coreOnlyKeys[0] || "None");
    if (!toppingKeys.includes(topping)) setTopping(toppingKeys[0] || "None");
    if (!dripKeys.includes(drip)) setDrip(dripKeys[0] || "None");
  }, [pack, recipe.name]);

  const buildFlavorItems = () => {
    const first = mergedFlavors[flavor1] || [];
    const second = mergedFlavors[flavor2] || [];
    if (flavor2 === "None" || splitMode === "Single") return first;
    const factors: Record<string, [number, number]> = {
      "50/50": [0.5, 0.5],
      Layered: [0.6, 0.6],
      Swirl: [0.65, 0.5],
      Single: [1, 0],
    };
    const [f1, f2] = factors[splitMode] || [0.5, 0.5];
    return [...scaleItems(first, f1), ...scaleItems(second, f2)];
  };

  let flavorList = buildFlavorItems();
  let swirlList = mergedSwirls[swirl] || [];
  let coreList = mergedSwirls[core] || [];
  let toppingList = mergedToppings[topping] || [];
  let dripList = mergedToppings[drip] || [];

  const isRiceCrispy = recipe.category === "Rice Crispy Treats";
  const isCake = recipe.category === "Cakes";
  const cakeLayerCount = isCake ? Number(cakeLayers) : 1;
  const combinedFlavorLabel =
    flavor2 !== "None" && splitMode !== "Single"
      ? `${flavor1} + ${flavor2} (${splitMode})`
      : flavor1;
  const combinedSwirlLabel = [swirl, core].filter((x) => x !== "None").join(" • ") || "None";
  const combinedToppingLabel = [topping, drip].filter((x) => x !== "None").join(" • ") || "None";

  const shouldUseChocolateCereal =
    isRiceCrispy && /(chocolate)/i.test(`${combinedFlavorLabel} ${recipe.name}`);

  let baseList = shouldUseChocolateCereal
    ? recipe.base.map(([name, amt]) =>
        name === "rice krispies cereal" ? (["chocolate crispy rice cereal", amt] as Ingredient) : [name, amt]
      )
    : recipe.base;

  baseList = applyGoalSystem(baseList, recipe.category, goal);
  baseList = applyFlavorSupportSystem(baseList, recipe.category, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);

  if (proteinMode === "No Whey") {
    baseList = applyNoWheySystem(baseList, recipe.category, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);
    flavorList = applyNoWheySystem(flavorList, recipe.category, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);
    swirlList = applyNoWheySystem(swirlList, recipe.category, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);
    coreList = applyNoWheySystem(coreList, recipe.category, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);
    toppingList = applyNoWheySystem(toppingList, recipe.category, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);
    dripList = applyNoWheySystem(dripList, recipe.category, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);
  }

  if (isRiceCrispy && proteinMode === "No Whey") {
    const riceMap = itemsToMap(baseList);
    bumpIngredient(riceMap, shouldUseChocolateCereal ? "chocolate crispy rice cereal" : "rice krispies cereal", 15);
    bumpIngredient(riceMap, "mini marshmallows", 5);
    baseList = mapToItems(riceMap);
  }

  baseList = applyTextureSystem(baseList, recipe.category, goal, proteinMode);

  if (cakeLayerCount > 1) {
    baseList = scaleItems(baseList, cakeLayerCount);
    flavorList = scaleItems(flavorList, cakeLayerCount);
    swirlList = scaleItems(swirlList, cakeLayerCount);
    coreList = scaleItems(coreList, cakeLayerCount);
    toppingList = scaleItems(toppingList, cakeLayerCount);
    dripList = scaleItems(dripList, cakeLayerCount);
  }

  const systemNotes = buildSystemNotes(recipe.category, goal, proteinMode, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);
  const baseMacros = calcMacros(baseList);
  const flavorMacros = calcMacros(flavorList);
  const swirlMacros = calcMacros([...swirlList, ...coreList]);
  const toppingMacros = calcMacros([...toppingList, ...dripList]);
  const totalMacros = addMacros(addMacros(addMacros(baseMacros, flavorMacros), swirlMacros), toppingMacros);
  const effectiveServings = recipe.servings * cakeLayerCount;

  const detailTitle = clientMode ? recipe.clientName : recipe.name;
  const detailedGuide = getDetailedGuide(recipe.name, combinedFlavorLabel, combinedSwirlLabel, combinedToppingLabel);

  const collectSteps = (mapObj: Record<string, string[]>, selections: string[], fallback: string[]) => {
    const gathered = selections.flatMap((selection) => (selection !== "None" ? (mapObj?.[selection] || []) : []));
    return gathered.length ? gathered : fallback;
  };

  const flavorMethodItems = collectSteps(recipe.flavorHow, [flavor1, flavor2], detailedGuide.flavorGuide);
  const swirlMethodItems = collectSteps(recipe.swirlBuild, [swirl, core], detailedGuide.swirlGuide);
  const toppingMethodItems = collectSteps(recipe.toppingHow, [topping, drip], detailedGuide.toppingGuide);

  const saveBuild = () => {
    const newBuild: SavedBuild = {
      id: makeSavedId(),
      customName: saveName.trim() || `${recipe.clientName} Build`,
      recipeName: recipe.name,
      goal,
      flavor: combinedFlavorLabel,
      swirl: combinedSwirlLabel,
      topping: combinedToppingLabel,
    };
    setSavedBuilds([newBuild, ...savedBuilds]);
    setSaveName("");
  };

  const exportBranded = () =>
    exportBrandedHTML(
      detailTitle,
      goal,
      effectiveServings,
      totalMacros,
      divideMacros(totalMacros, effectiveServings),
      combinedFlavorLabel,
      combinedSwirlLabel,
      combinedToppingLabel,
      baseList,
      flavorList,
      [...swirlList, ...coreList],
      [...toppingList, ...dripList],
      recipe.method,
      flavorMethodItems,
      swirlMethodItems,
      toppingMethodItems,
      recipe.creami
    );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }}>
      <div className="overflow-hidden rounded-3xl border border-yellow-700/35 bg-neutral-950 shadow-xl">
        <div className="border-b border-yellow-700/20 bg-gradient-to-r from-yellow-900/10 to-transparent p-5 sm:p-6">
          <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-yellow-500">{recipe.category}</div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-yellow-300">{detailTitle}</h2>
                <div className="mt-1 text-sm text-neutral-400">
                  Servings: {effectiveServings}{isCake ? ` • ${cakeLayerCount} layer${cakeLayerCount > 1 ? "s" : ""}` : ""}
                </div>
              </div>
              <img src={BRAND.logos.mark} alt="" className="h-16 w-16 object-contain opacity-95" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <ControlCard label="Flavor 1">
                <AppSelect value={flavor1} onChange={(e) => setFlavor1(e.target.value)} options={flavorKeys} />
              </ControlCard>
              <ControlCard label="Flavor 2">
                <AppSelect value={flavor2} onChange={(e) => setFlavor2(e.target.value)} options={flavorKeys} />
              </ControlCard>
              <ControlCard label="Split / Build Style">
                <AppSelect value={splitMode} onChange={(e) => setSplitMode(e.target.value as any)} options={["Single", "50/50", "Layered", "Swirl"]} />
              </ControlCard>
              {isCake ? (
                <ControlCard label="Cake Layers">
                  <AppSelect value={cakeLayers} onChange={(e) => setCakeLayers(e.target.value)} options={["1", "2", "3"]} />
                </ControlCard>
              ) : (
                <ControlCard label="Protein Source">
                  <div className="h-12 flex items-center rounded-2xl border border-yellow-700/40 bg-neutral-900 px-4 text-sm text-neutral-300">{proteinMode}</div>
                </ControlCard>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <ControlCard label="Swirls (A–Z)">
                <AppSelect value={swirl} onChange={(e) => setSwirl(e.target.value)} options={swirlOnlyKeys} />
              </ControlCard>
              <ControlCard label="Cores (A–Z)">
                <AppSelect value={core} onChange={(e) => setCore(e.target.value)} options={coreOnlyKeys} />
              </ControlCard>
              <ControlCard label="Toppings (A–Z)">
                <AppSelect value={topping} onChange={(e) => setTopping(e.target.value)} options={toppingKeys} />
              </ControlCard>
              <ControlCard label="Drips / Frosts (A–Z)">
                <AppSelect value={drip} onChange={(e) => setDrip(e.target.value)} options={dripKeys} />
              </ControlCard>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {isCake && (
            <Panel title="Cake Preview">
              <div className="flex min-h-[190px] items-end justify-center gap-3 rounded-2xl bg-neutral-900/70 p-6">
                <div className="flex flex-col items-center gap-2">
                  {Array.from({ length: cakeLayerCount }).map((_, i) => (
                    <div key={i} className="w-48 rounded-xl border border-yellow-700/30 bg-gradient-to-r from-yellow-700/20 to-yellow-500/10 px-3 py-3 text-center text-xs text-neutral-100 shadow-lg">
                      <div className="font-semibold text-yellow-300">Layer {cakeLayerCount - i}</div>
                      <div>{i % 2 === 0 ? flavor1 : flavor2 !== "None" ? flavor2 : flavor1}</div>
                    </div>
                  ))}
                  {core !== "None" && <div className="text-xs text-neutral-400">Core: {core}</div>}
                  {swirl !== "None" && <div className="text-xs text-neutral-400">Swirl: {swirl}</div>}
                  {combinedToppingLabel !== "None" && <div className="text-xs text-neutral-400">Finish: {combinedToppingLabel}</div>}
                </div>
              </div>
            </Panel>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Base Batch" value={fmt(baseMacros)} icon={<ChefHat className="h-4 w-4" />} />
            <StatCard title="Final Batch" value={fmt(totalMacros)} icon={<Sparkles className="h-4 w-4" />} />
            <StatCard title="Per Serving" value={fmt(divideMacros(totalMacros, effectiveServings))} icon={<Calculator className="h-4 w-4" />} />
            <StatCard title="Build" value={`${combinedFlavorLabel} • ${combinedSwirlLabel} • ${combinedToppingLabel} • ${proteinMode}`} icon={<Layers3 className="h-4 w-4" />} />
          </div>

          <div className="rounded-2xl border border-yellow-700/30 bg-yellow-500/10 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Name this build"
                className="h-12 rounded-2xl border border-yellow-700/40 bg-neutral-900 px-4 text-white outline-none transition focus:border-yellow-500"
              />
              <button
                onClick={saveBuild}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-yellow-500 px-5 font-semibold text-black transition hover:bg-yellow-400"
              >
                <Save className="h-4 w-4" />
                Save Build
              </button>
              <button
                onClick={exportBranded}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-yellow-700/40 bg-neutral-950 px-5 text-white transition hover:border-yellow-500"
              >
                <Download className="h-4 w-4" />
                Branded Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel title="Ingredients Breakdown">
              <div className="space-y-3 text-sm">
                <IngredientGroup title="Base" items={baseList} />
                <IngredientGroup title={`Flavor Build (${combinedFlavorLabel})`} items={flavorList} />
                <IngredientGroup title={`Swirls (${swirl})`} items={swirlList} />
                <IngredientGroup title={`Cores (${core})`} items={coreList} />
                <IngredientGroup title={`Toppings (${topping})`} items={toppingList} />
                <IngredientGroup title={`Drips / Frosts (${drip})`} items={dripList} />
              </div>
            </Panel>

            <Panel title="Build Deltas">
              <div className="space-y-3 text-sm">
                <DeltaRow label={`Flavor: ${combinedFlavorLabel}`} batch={fmt(flavorMacros)} per={fmt(divideMacros(flavorMacros, effectiveServings))} />
                <DeltaRow label={`Swirls + Cores: ${combinedSwirlLabel}`} batch={fmt(swirlMacros)} per={fmt(divideMacros(swirlMacros, effectiveServings))} />
                <DeltaRow label={`Toppings + Drips: ${combinedToppingLabel}`} batch={fmt(toppingMacros)} per={fmt(divideMacros(toppingMacros, effectiveServings))} />
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel title="Main Method">
              <ol className="list-decimal space-y-3 pl-5 text-sm text-neutral-200">
                {recipe.method.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </Panel>

            <div className="space-y-6">
              <Panel title="Flavor Build Method">
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {flavorMethodItems.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Swirl / Core Build Method">
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {swirlMethodItems.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Topping / Drip Method">
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {toppingMethodItems.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Ninja Creami Conversion" icon={<IceCreamBowl className="h-4 w-4" />}>
                <ul className="list-disc space-y-3 pl-5 text-sm text-neutral-200">
                  {recipe.creami.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Panel title="Elite System Adjustments">
              <div className="space-y-4 text-sm text-neutral-200">
                <GuideSection title="What changed in this build" items={systemNotes} />
                <GuideSection title="How to add the flavor" items={detailedGuide.flavorGuide} />
                <GuideSection title="How to build the swirl / core" items={detailedGuide.swirlGuide} />
                <GuideSection title="How to finish the topping / drip" items={detailedGuide.toppingGuide} />
              </div>
            </Panel>

            <Panel title="Texture & Macro Disclaimer">
              <div className="space-y-4 text-sm text-neutral-200">
                <GuideSection title="Texture notes" items={detailedGuide.textureTips} />
                <div className="rounded-2xl border border-yellow-700/20 bg-neutral-950/70 p-4 text-sm leading-6 text-neutral-300">
                  <div className="mb-2 font-medium text-yellow-300">Macro disclaimer</div>
                  <p>
                    Macros in this app are calculated from the ingredient database built into the system using standard estimated nutrition values per gram or per unit.
                    They are best used as a consistent coaching estimate, not as a lab-tested guarantee. Brand differences, moisture loss during baking,
                    fruit size, spread amounts, cereal variation, and how much topping or drip is actually used can all change the real final macros.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Panel({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/60">
      <div className="border-b border-yellow-700/15 px-4 py-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-yellow-300">
          {icon}
          {title}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ControlCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs text-neutral-400">{label}</div>
      {children}
    </div>
  );
}

function AppSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-12 w-full rounded-2xl border border-yellow-700/40 bg-neutral-900 px-4 text-white outline-none transition focus:border-yellow-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-neutral-900">
          {opt}
        </option>
      ))}
    </select>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-700/30 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-200">
      <span className="text-yellow-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-900/70 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-yellow-300">
        {icon}
        <span>{title}</span>
      </div>
      <div className="break-words text-sm font-medium leading-relaxed text-neutral-100 sm:text-base">{value}</div>
    </div>
  );
}

function IngredientGroup({ title, items }: { title: string; items: Ingredient[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-yellow-700/20 p-3">
      <div className="mb-2 font-semibold text-yellow-300">{title}</div>
      <ul className="space-y-1 text-neutral-200">
        {items.map((item, i) => (
          <li key={`${title}-${i}`}>{ingredientLine(item)}</li>
        ))}
      </ul>
    </div>
  );
}


function GuideSection({ title, items }: { title: string; items: string[] }) {
  const safeItems = items.length ? items : ["No extra notes for this build."];
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-950/70 p-3">
      <div className="mb-2 font-medium text-yellow-300">{title}</div>
      <ul className="list-disc space-y-2 pl-5 text-neutral-200">
        {safeItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}


function DeltaRow({ label, batch, per }: { label: string; batch: string; per: string }) {
  return (
    <div className="rounded-2xl border border-yellow-700/20 bg-neutral-950/70 p-3">
      <div className="mb-2 font-medium text-yellow-300">{label}</div>
      <div className="text-neutral-300">Batch: {batch}</div>
      <div className="mt-1 text-neutral-400">Per serving: {per}</div>
    </div>
  );
}
