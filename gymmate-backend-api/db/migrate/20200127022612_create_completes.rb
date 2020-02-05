class CreateCompletes < ActiveRecord::Migration[5.2]
  def change
    create_table :completes do |t|
      t.references :workout, foreign_key: true
      t.references :exercise
      t.integer :sets
      t.timestamps
    end
  end
end
