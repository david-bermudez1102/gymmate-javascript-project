class AddCaloriesToExercises < ActiveRecord::Migration[5.2]
  def change
    add_column :exercises, :calories, :string
  end
end
