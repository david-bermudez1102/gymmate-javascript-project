class CreateExercises < ActiveRecord::Migration[5.2]
  def change
    create_table :exercises do |t|
      t.string :title
      t.string :description
      t.integer :sets
      t.integer :repetitions
      t.references :program
      t.timestamps
    end
  end
end
