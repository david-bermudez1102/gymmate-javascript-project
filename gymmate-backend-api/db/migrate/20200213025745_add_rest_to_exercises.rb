class AddRestToExercises < ActiveRecord::Migration[5.2]
  def change
    add_column :exercises, :rest, :integer
  end
end
