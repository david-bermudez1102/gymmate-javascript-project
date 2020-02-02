class CreateMedia < ActiveRecord::Migration[5.2]
  def change
    create_table :media do |t|
      t.text :caption
      t.references :mediable, polymorphic: true
      t.references :account
      t.timestamps
    end
  end
end
